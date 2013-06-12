/**
 * NotebookNumbers.js -- version 0.0.3
 *
 * @module NotebookNumbers
 * @author silleknarf
**/

/**
 * Base class for the app, handles preloading and running the main loop
 *
 * @class NotebookNumbers
 * @constructor
**/
function NotebookNumbers() {
	this.init();
} 

/**
 * Add Backbone.js events to the button
 *
 * @method vent
 * @extends Backbone.Events
 **/
NotebookNumbers.vent = _.extend(NotebookNumbers, Backbone.Events);

//NotebookNumbers.prototype = new Grid();

/**
 * Intialises the easel.js stage, sets up the grid properties and preloads the images
 *
 * @method init
 **/
NotebookNumbers.prototype.init = function() {
	this.selected = []
	this.stage = new createjs.Stage('notebooknumbers');	

	// Enable touch screen support
	//createjs.Touch.enable(this.stage);
			
	// Enable fast cursor
	this.stage.enableMouseOver();

	this.navy = "#003266";
	this.font = "Londrina Solid"
	//this.font = "Annie Use Your Telescope"

	// Setup the display properties of the grid
	this.cells = new createjs.Container();
	this.width = 700;
	this.numColumns = 9;
	this.height = 3000;
	this.cellHeight = 40;
	this.marginLeft = 15;
	this.marginTop = 15;
	this.stage.addChild(this.cells);

	// TODO: Setup mode selection
	NotebookNumbers.vent.on("TUTORIAL", this.initTutorial, this);
	NotebookNumbers.vent.on("TIME_TRIAL", this.initTimeTrial, this);

	// Setup stats update
	NotebookNumbers.vent.on("STATS:UPDATE", this.updateStats, this);

	// Drawing Events
	NotebookNumbers.vent.on("GRID:NUMBERS_UPDATED", this.updateCells, this);

	// Load the grid game logic
	this.grid = new Grid();
	this.stage.addChild(this.grid);

	// Preload the images
	this.assets = {};
	this.loadImages();

 	createjs.EventDispatcher.initialize(NotebookNumbers.prototype);
}

/**
 * Preloads the images that are used for the game
 *
 * @method loadImages
 **/
NotebookNumbers.prototype.loadImages = function() {
	manifest = [	{src:'img/scribble.png', id: 'scribble'},
		 	{src:'img/tile.png',id: 'background'},
			{src: 'img/bindings.png',id:'bindings'}]; 
	for (var i = 1; i <= 9; i++) {
		var digit = i;
		var image = 'img/'+digit+'.png';
		manifest.push({src: image, id: digit});
	}
	// Create an image loader with handlers
	loader = new createjs.LoadQueue();
	loader.addEventListener("fileload", this.handleFileLoad);
	loader.addEventListener("complete", this.handleComplete);
	// Pass the manifest to the image loader
	loader.loadManifest(manifest);
	//this.stage.autoClear = false;
}

/**
 *  Callback function from the preloader to store the images in the app.assets object
 *
 *  @method handleFileLoad
 **/
NotebookNumbers.prototype.handleFileLoad = function(event) {
 	app.assets[event.item.id] = event.result;
}

/**
 *  Callback function for when the images have all been loaded
 *
 *  @method handleComplete
 **/
NotebookNumbers.prototype.handleComplete = function() {
	// Log the preloaded files for now
	for (var i = 0; i < app.assets.length; i++) {
		var item = app.assets[i]; //loader.getResult(id);
		console.log(item);
	}
	// Start the game
	app.initGame();
}

/**
 *  Draws the background and starts the main loop
 *
 *  @method initGame
 **/
NotebookNumbers.prototype.initGame = function() {
	
	// Draw the background
	this.background = new BackgroundView(this.width, this.height);
	this.stage.addChildAt(this.background, 0);

	// Add the refill grid button
	this.refillGridButton = new RefillGridView(this.width, this.getHeight()); 
	this.stage.addChild(this.refillGridButton);

	// Trigger the numbers updated event
	NotebookNumbers.vent.trigger("GRID:NUMBERS_UPDATED");
	NotebookNumbers.vent.trigger("GRID:HEIGHT_UPDATED");

	// Now we can start the main loop
	createjs.Ticker.setFPS(25);
	createjs.Ticker.addListener(this);

	//NotebookNumbers.vent.trigger("TUTORIAL");
	NotebookNumbers.vent.trigger("TIME_TRIAL");
}


NotebookNumbers.prototype.addTutorialLevel = function(text, grid, position) {
	var marginLeft = 10;
	
	var sameNumber = new createjs.Text(text, "24px "+this.font, this.navy);
	sameNumber.x = this.marginLeft+marginLeft;
	sameNumber.y = this.marginTop+this.cellHeight*position;
	this.stage.addChild(sameNumber);
	this.tutorial = this.tutorial.concat(grid);
}

NotebookNumbers.prototype.initTutorial = function() {
	this.stage.removeChild(this.refillGridButton);

	// Add text to help
	var controls = "HIGHLIGHT:\n\n Hover over number\n\n\n";
	controls += "SELECT MODE OR CROSS OUT:\n\n Click once on the number";
	var overview = new createjs.Text(controls, "22px "+this.font, this.navy);
	overview.x = this.marginLeft+this.width+60;
	overview.y = this.marginTop+20;
	overview.lineWidth = 350;
	this.stage.addChild(overview);

	// Setup tutorial
	this.tutorial = [];
	this.level = 0;
	this.nextLevel();

	// If grid completed do next tutorial level
	NotebookNumbers.vent.on("GRID:COMPLETED", this.nextLevel, this);
}

NotebookNumbers.prototype.nextLevel = function() {

	this.level += 1;

	// Horizontal Same 
	if (this.level == 1)
		this.addTutorialLevel("If two numbers are the same, then they can be crossed out", [[0], [1,1]], 0);

	// Horizontal spaces
	if (this.level == 2)
		this.addTutorialLevel("If there is a gap between numbers, then you can play through it", [[0], [4,0,4,5,0,0,5]], 2);

	// Horizontal add to 10
	if (this.level == 3)
		this.addTutorialLevel("If two numbers add to 10, then they can be crossed out", [[0],[2,0,0,8]], 4);

	// Vertical add to 10 or same
	if (this.level == 4)
		this.addTutorialLevel("Two numbers can be beside each other vertically", [[0],[3,0,0,1],[7,0,0,0],[0,0,0,1]], 6);

	// New line move twice
	if (this.level == 5) {
		var grid = [[0],[0,0,0,0,0,0,0,8,9],[1,2,0,0,0,0,0,0,0]];
		this.addTutorialLevel("Two numbers are beside each other, from the end of one line to \n\nthe start of the next", grid, 10);
	}

	// Mini Game
	if (this.level == 6) {
		this.stage.addChild(this.refillGridButton);
		var grid = [[0], [5,4,3,2,1,9,8,7,6]];
		this.addTutorialLevel("If there are no more moves to play, you must click refill grid", grid, 13);
	}

	// Tutorial Complete
	if (this.level == 7) {
		// Congratulate user, they can now play Notebook Numbers!	
	}
	
	this.grid.data = this.tutorial;

	NotebookNumbers.vent.trigger("GRID:NUMBERS_UPDATED");
	NotebookNumbers.vent.trigger("GRID:HEIGHT_UPDATED");
	// Create achievements that unlock the next board
}

NotebookNumbers.prototype.initTimeTrial = function() {
	this.time = 60;
	this.score = 0;
	this.finalScore = 0;
	this.divider = 1;
	NotebookNumbers.vent.on("CURSOR:MAKE_MOVE", this.moveMade, this);
	//NotebookNumbers.vent.on("REFILL_GRID", this.refillGrid, this);
	NotebookNumbers.vent.on("STATS:PERCENTAGE_CLEARED", this.percentCleared, this);

	this.overview = new createjs.Text("", "22px "+this.font, this.navy);
	this.updateStats();
	NotebookNumbers.vent.trigger("GRID:NUMBERS_UPDATED");
}

NotebookNumbers.prototype.moveMade = function() {
	this.score += 100;
}

NotebookNumbers.prototype.percentCleared = function(percentageCleared) {
	this.divider += percentageCleared;
}

NotebookNumbers.prototype.updateStats = function() {

	var score = (this.score/this.divider).toFixed(0);
	if (this.time < 0 && this.finalScore == 0) {
		this.finalScore = score;
	}

	var time = this.time;
	if (this.time < 0) {
		score = this.finalScore;

		var stats = "TIME UP!\n\n\n";
		stats += "FINAL SCORE:\n\n "+score;
	} else {
		var stats = "TIME REMAINING:\n\n "+time+"\n\n\n";
		stats += "SCORE:\n\n "+score;
	}

	this.stage.removeChild(this.overview);
	this.overview = new createjs.Text(stats, "30px "+this.font, this.navy);
	this.overview.x = this.marginLeft+this.width+60;
	this.overview.y = this.marginTop+20;
	this.overview.lineWidth = 350;
	this.stage.addChild(this.overview);
}

/**
 * Main Loop
 *
 * @method tick
 **/
NotebookNumbers.prototype.tick = function(evt) {
	// Update all the objects on the easel.js stage
	this.stage.update();
	if (this.time) 
		this.time -= 1/25;
		this.time = this.time.toFixed(3);
	NotebookNumbers.vent.trigger("STATS:UPDATE");
}

/** 
 *  Removes all the crells from the grid and readds and updated version, also checks if each of the cells is in the cursor
 *
 *  @method updateCells
 **/
NotebookNumbers.prototype.updateCells = function() {

	this.cells.removeAllChildren();
	var width = this.width / this.numColumns;
	var height = this.cellHeight;
	var grid = this.grid.data;
	var cursor = this.grid.cursor.cells;

	for (var i = 0; i < grid.length; i++) {
		for (var j = 0; j < grid[i].length; j++) {
			var digit = grid[i][j];
			var allowClick = true;
			var cell = new Cell(i, j, width, height, digit, allowClick);
			for (var k = 0; k < cursor.length; k++) {
				if (cell.equals(cursor[k])) {
					cell.inCursor = true;
				}
			}
			this.cells.addChild(cell);
		}	
	}
}


NotebookNumbers.prototype.getHeight = function() {
	var height = this.cellHeight*this.grid.data.length+this.marginTop;
	return height;
}

NotebookNumbers.prototype.getBottom = function() {
	var buttonPadding = 65;
	var bottom = this.getHeight()+buttonPadding;
	return Math.max(bottom, 820);
}

/**
 * Application Entry Point 
 *
 * @method init
 **/
function init() {
	app = new NotebookNumbers();
}
