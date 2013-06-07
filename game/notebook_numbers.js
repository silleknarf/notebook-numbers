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

	// Setup the display properties of the grid
	this.cells = new createjs.Container();
	this.width = 700;
	this.numColumns = 9;
	this.height = 3000;
	this.cellHeight = 40;
	this.marginLeft = 15;
	this.marginTop = 15;
	this.stage.addChild(this.cells);

	// TODO: Setup tutorial mode
	NotebookNumbers.vent.on("TUTORIAL", this.initTutorial, this);

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
		 	{src:'img/graph_paper_large.jpg',id: 'background'},
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
	// Drawing Events
	NotebookNumbers.vent.on("GRID:NUMBERS_UPDATED", this.updateCells, this);
	NotebookNumbers.vent.on("GRID:HEIGHT_UPDATED", this.updateCanvas, this);
	
	// Draw the background
	this.background = new BackgroundView(this.width, this.height);
	this.stage.addChildAt(this.background, 0);

	// Trigger the numbers updated event
	NotebookNumbers.vent.trigger("GRID:NUMBERS_UPDATED");

	// Add the refill grid button
	this.refillGridButton = new RefillGridView(this.width, this.getHeight()); 
	this.stage.addChild(this.refillGridButton);

	// Now we can start the main loop
	createjs.Ticker.setFPS(25);
	createjs.Ticker.addListener(this);

	NotebookNumbers.vent.trigger("TUTORIAL");
}

NotebookNumbers.prototype.initTutorial = function() {
	//this.refillGridEnabled = false;
	//this.stage.removeChild(this.refillGridButton);

	var marginLeft = 10;
	// Add text to help
	var overview = new createjs.Text("SELECT MODE OR CROSS OUT:\n\nClick once on the number", "22px Helvetica", "#000000");
	overview.x = this.marginLeft+this.width+50;
	overview.y = this.marginTop+20;
	overview.lineWidth = 300;
	this.stage.addChild(overview);

	// Setup tutorial
	var tutorial = [ [0], [1,1] ,[0], [4,0,4,5,0,0,5],[0],[2,0,0,8],[0],[3,0,0,1],[7,0,0,0],[0,0,0,1],[0],[0,0,0,0,0,0,0,8,9],[1,2,0,0,0,0,0,0,0]];
	// Tutorial part two
	tutorial.push([0]);
	tutorial.push([1,1,1,1,9,9,9]);
	this.grid.data = tutorial;

	// Add text to help
	var sameNumber = new createjs.Text("Two numbers that are the same can be crossed out ", "22px Helvetica", "#000000");
	sameNumber.x = this.marginLeft+marginLeft;
	sameNumber.y = this.marginTop;
	this.stage.addChild(sameNumber);

	// Add text to help
	var sameNumber = new createjs.Text("You can play through gaps", "22px Helvetica", "#000000");
	sameNumber.x = this.marginLeft+marginLeft;
	sameNumber.y = this.marginTop+this.cellHeight*2;
	this.stage.addChild(sameNumber);

	// Add text to help
	var sameNumber = new createjs.Text("You can also cross them out if they add to 10", "22px Helvetica", "#000000");
	sameNumber.x = this.marginLeft+marginLeft;
	sameNumber.y = this.marginTop+this.cellHeight*4;
	this.stage.addChild(sameNumber);

	// Add text to help
	var sameNumber = new createjs.Text("You can play moves vertically", "22px Helvetica", "#000000");
	sameNumber.x = this.marginLeft+marginLeft;
	sameNumber.y = this.marginTop+this.cellHeight*6;
	this.stage.addChild(sameNumber);

	// Add text to help
	var sameNumber = new createjs.Text("Play moves from the end of a line to the start of the next", "22px Helvetica", "#000000");
	sameNumber.x = this.marginLeft+marginLeft;
	sameNumber.y = this.marginTop+this.cellHeight*10;
	this.stage.addChild(sameNumber);

	// Add text to help
	var sameNumber = new createjs.Text("When there are no more moves you can play, click refill grid", "22px Helvetica", "#000000");
	sameNumber.x = this.marginLeft+marginLeft;
	sameNumber.y = this.marginTop+this.cellHeight*13;
	this.stage.addChild(sameNumber);

	NotebookNumbers.vent.trigger("GRID:NUMBERS_UPDATED");
	NotebookNumbers.vent.trigger("GRID:HEIGHT_UPDATED");
	// Create achievements that unlock the next board
}

/**
 * Main Loop
 *
 * @method tick
 **/
NotebookNumbers.prototype.tick = function() {
	// Update all the objects on the easel.js stage
	this.stage.update();
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

// This should be moved to background_view and be triggered by an event
NotebookNumbers.prototype.updateCanvas = function() {
	// Resize the canvas
	var canvas = document.getElementById("notebooknumbers");
	var buttonPadding = 15;
	canvas.height = this.getHeight()+this.refillGridButton.height+buttonPadding;

	// TODO: Resize the bindings and the cover
}

NotebookNumbers.prototype.getHeight = function() {
	var height = this.cellHeight*this.grid.data.length+this.marginTop;
	return height;
}

/**
 * Application Entry Point 
 *
 * @method init
 **/
function init() {
	app = new NotebookNumbers();
}
