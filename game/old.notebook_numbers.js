/**
 * NotebookNumbers.js -- version 0.0.4
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
var NotebookNumbers = function() {
    this.init();
}

/**
 * Initialise the easel.js environment
 *
 * @method init
 **/
NotebookNumbers.prototype.init = function() {
    this.selected = [];
    // Create the easel stage
    this.stage = new createjs.Stage('notebooknumbers');
    // Create the dimensions object
	this.dimensions = new Dimensions();
    // Set the stage parameters from the dimensions object
	this.stage.canvas.width = Math.floor(this.dimensions.fullWidth);
	console.log("Inital width: "+this.stage.canvas.width+"px");

    // Preload the images
    var preloader = preloader();
    _.extend(this, preloader);
    this.loadImages(this.initGame);

    // More stage set up
    // Enable touch screen support
	if (createjs.Touch.isSupported()) {
		console.log("Touch enabled version");
		createjs.Touch.enable(this.stage);
	} else {
		console.log("Non-touch enabled version");
		this.stage.enableMouseOver();
	}

    // Some game logic initialisation
    this.cells = new createjs.Container();

    // Drawing Events
    eventManager.vent.on(Grid.events.render, this.render, this);
}

/**
 *  Draws the background and starts the main loop
 *
 *  @method initGame
 **/
NotebookNumbers.prototype.initGame = function() {
    console.log("notebook_numbers:initGame");

    // Create some easel objects used for the game
    this.background = new BackgroundView(this.assets, this.dimensions);
    this.refillGridButton = new RefillGridButton(this.dimensions);

    // Now we can start the main loop
    createjs.Ticker.setFPS(25);
    createjs.Ticker.on("tick", this.tick, this);

    // Set up some events which call methods in this class
    eventManager.vent.on(events.tutorial, this.initTutorial, this);
    eventManager.vent.on(events.newGame, this.initNewGame, this);

    // Start the event system
    createjs.EventDispatcher.initialize(NotebookNumbers.prototype);

    // Trigger the start game event
    eventManager.vent.trigger(events.newGame);
}

NotebookNumbers.prototype.initTutorial = function() {
    // Clean up old events
    if (this.grid)
        this.grid.cleanUpEvents();

    // Initialise the tutorial
    this.tutorial = {};
    this.tutorial.__proto__ = Tutorial.prototype;
    _.extend(this, this.tutorial);

    // Start up the tutorial injecting dimensions
    this.tutorial.initialize.call(this, [this.dimensions]);
}

NotebookNumbers.prototype.initNewGame = function() {
    // Clean up events depending on what mode is started
	if (typeof(this.grid) !== 'undefined')
		this.grid.cleanUpEvents();
    if (typeof(this.tutorial) !== 'undefined')
        this.tutorial.cleanUpEvents();

    // Configure the stage with various easel components
    this.stage.removeAllChildren();
    var gridWidth = 9;
    // Initalise the game logic
    this.grid = new Grid(gridWidth, this.dimensions);
    this.dimensions.gridHeight = this.grid.length;
    this.stage.addChild(this.grid);
    this.stage.addChild(this.refillGridButton);
    this.stage.addChild(this.cells);
    this.stage.addChildAt(this.background, 0);

    // Trigger the numbers updated event
    eventManager.vent.trigger(Grid.events.render);
    eventManager.vent.trigger(BackgroundView.events.render);
}

// Update the easel.js stage
NotebookNumbers.prototype.tick = function(evt) {
    this.stage.update();
}

/** 
 *  Removes all the cells from the grid and readds an updated version, also checks if each of the cells is in the cursor
 *
 *  @method render
 **/
NotebookNumbers.prototype.render = function() {
    // Clears up the easel game objects
    this.cells.removeAllChildren();

    // Updates the dimension object and lets it know how big the game is?
    this.dimensions.gridHeight = this.grid.data.length;
	this.dimensions.update();

    // Work out the stage size and config the parameters of the grid accordingly - wtf
	var stageWidth = this.stage.canvas.width;
	var newStageWidth = Math.floor(this.dimensions.fullWidth);
	if (stageWidth !== newStageWidth)
		this.stage.canvas.width = newStageWidth;

	var bindingWidth = this.dimensions.isVerticalLayout ? 0 : 40;
    var width = (this.dimensions.pageWidth - bindingWidth) / config.numColumns;
    var height = config.cellHeight;
    var grid = this.grid.data;
    var cursor = this.grid.cursor.cells;

    // Create each cell and add it to the grid
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
            var digit = grid[i][j];
            var allowClick = true;
            var cell = new Cell(i, j, width, height, digit, allowClick, this.dimensions);
            for (var k = 0; k < cursor.length; k++) {
                if (cell.equals(cursor[k])) {
                    cell.inCursor = true;
                }
            }
            this.cells.addChild(cell);
        }
    }
}

function init() {
    // ReSharper disable once WrongExpressionStatement
    new NotebookNumbers();
}

window.init = init;
