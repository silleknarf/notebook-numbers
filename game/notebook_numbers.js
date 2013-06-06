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

NotebookNumbers.prototype = new Grid();

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
	this.numColums = 9;
	this.height = 3000;
	this.cellHeight = 40;
	this.marginLeft = 15;
	this.marginTop = 15;
	this.stage.addChild(this.cells);

	// Load the grid game logic
	this.grid = new Grid();

	// Preload the images
	this.assets = {};
	this.loadImages();

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
 *  Callback function for whene the images have all been loaded
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
	// Draw things
	app.drawBackground();
	app.updateCells();
	app.drawRefillGridButton();

	// Now we can start the main loop
	createjs.Ticker.setFPS(25);
	createjs.Ticker.addListener(this);
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
	var width = this.width / this.numColums;
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

/** 
 * Draws the notebooks using a rounded rectangle, some bindings and a right side panel (banderole)
 *
 * @method drawBackground
 **/
NotebookNumbers.prototype.drawBackground = function() {

	// Draw the outermost cover
	var coverMargin = 10;
	var cover = new createjs.Shape();

	//var blue = "#000066";
	var navy = "#003266";
	var minHeight = Math.max(this.height, 2600);
	cover.graphics.beginFill(navy).drawRoundRect(0, 0, this.width*2+coverMargin*2+20, minHeight, 30);
	this.stage.addChildAt(cover, 0);

	var leftPage = new createjs.Bitmap(app.assets['background']);
	leftPage.x = coverMargin;
	leftPage.y = coverMargin;
	leftPage.sourceRect = new createjs.Rectangle(0,0,this.width, minHeight);

	this.stage.addChildAt(leftPage, 1);

	var rightPage = new createjs.Bitmap(app.assets['background']);
	rightPage.x = this.width+coverMargin+20;
	rightPage.y = coverMargin; 
	rightPage.sourceRect = new createjs.Rectangle(0,0,this.width, minHeight);
	this.stage.addChildAt(rightPage, 2);

	// Draw the banderole on the right hand side
	var banderole = new createjs.Shape();
	banderole.graphics.beginFill(navy).drawRect(0, 0, (this.width/2), minHeight, 30);
	banderole.x = rightPage.x + (this.width/2);
	banderole.y = coverMargin; 
	this.stage.addChildAt(banderole, 3);

	// Draw the bindings in the middle
	for (var i = 0; i < 5; i++) {
		var bindings = new createjs.Bitmap(app.assets['bindings']);
		bindings.x = this.width - 20;
		bindings.y = 10+(i*225);
		bindings.scaleX = 0.6;
		bindings.scaleY = 0.6;
		//bindings.sourceRect = new createjs.Rectangle(0,0,20,30);
		this.stage.addChildAt(bindings, 3);
	}
}

/** 
 * Draws the button that refills the grid when you have no more moves to make
 *
 * @method drawRefillGridButton
 **/
NotebookNumbers.prototype.drawRefillGridButton = function() {
	this.refillGridButton = new createjs.Container();

	// Setting up the text properties
 	var refillGrid = new createjs.Text("Refill Grid", "32px Helvetica", "#000000");

	// Setting up the button positioning
	var middleX = this.width/2;
	var refillGridPadding = 100;
	refillGrid.x = middleX - refillGridPadding;

	var topPadding = 15;
	refillGrid.gridBottom = this.cellHeight * this.grid.data.length;
	refillGrid.y = topPadding+refillGrid.gridBottom+app.marginTop;
 
	// Adding collision detection
	var hit = new createjs.Shape();
	hit.graphics.beginFill("#F00").drawRect(0, 0, refillGrid.getMeasuredWidth(), refillGrid.getMeasuredHeight());
	refillGrid.hitArea = hit;

	/**
	 *  Refill Grid Click Event - updates the cells and move the button down
	 *  @event onClick
	 **/
	refillGrid.onClick = function(evt) {
		// Perform the refill grid logic
		app.grid.refillGrid();

		// Update the cells
		app.updateCells();

		// Move the button down
		var gridBottom = app.cellHeight * app.grid.data.length;
		var buttonPadding = 15;
		var yCoOrd = gridBottom + buttonPadding + app.marginTop;
		this.y = yCoOrd;

		// Resize the canvas
		var canvas = document.getElementById("notebooknumbers");
    		canvas.height = yCoOrd+this.getMeasuredHeight()+buttonPadding;

		// TODO: Resize the bindings and the cover
	}
	this.stage.addChild(refillGrid);
}
/**
 * Application Entry Point 
 *
 * @method init
 **/
function init() {
	app = new NotebookNumbers();
}
