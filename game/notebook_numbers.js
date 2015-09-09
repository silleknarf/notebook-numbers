/**
 * NotebookNumbers.js -- version 0.0.4
 *
 * @module NotebookNumbers
 * @author silleknarf
**/
(function () {
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
     * Intialises the easel.js stage, sets up the grid properties and preloads the images
     *
     * @method init
     **/
    NotebookNumbers.prototype.init = function() {
        this.selected = [];
        this.stage = new createjs.Stage('notebooknumbers');
		this.dimensions = new Dimensions();
		this.stage.canvas.width = Math.floor(this.dimensions.fullWidth);


        // Preload the images
        _.extend(this, preload);
        this.loadImages(this.initGame);

        // Enable touch screen support
		if (createjs.Touch.isSupported()) {
			console.log("Touch enabled version");
			createjs.Touch.enable(this.stage);
		} else {
			console.log("Non-touch enabled version");
			this.stage.enableMouseOver();
		}

        this.cells = new createjs.Container();

        // Drawing Events
        eventManager.vent.on("GRID:RENDER", this.render, this);
    }

    /**
     *  Draws the background and starts the main loop
     *
     *  @method initGame
     **/
    NotebookNumbers.prototype.initGame = function() {
        console.log("notebook_numbers:initGame");
        // Draw the background
        var context = this;
        var getHeightFunc = function() {
            return context.getHeight.call(context);
        }
        this.background = new BackgroundView(getHeightFunc, this.assets, this.dimensions);

        // Add the refill grid button
        this.refillGridButton = new RefillGridButton(getHeightFunc, this.dimensions);

        // Now we can start the main loop
        createjs.Ticker.setFPS(25);
        createjs.Ticker.addListener(this);

        eventManager.vent.on("NOTEBOOKNUMBERS:TUTORIAL", this.initTutorial, this);
        eventManager.vent.on("NOTEBOOKNUMBERS:NEWGAME", this.initNewGame, this);

        createjs.EventDispatcher.initialize(NotebookNumbers.prototype);

        eventManager.vent.trigger("NOTEBOOKNUMBERS:NEWGAME");
    }

    NotebookNumbers.prototype.initTutorial = function() {
        if (this.grid)
            this.grid.cleanUpEvents();
        this.tutorial = {};
        this.tutorial.__proto__ = Tutorial.prototype;
        _.extend(this, this.tutorial);

        this.tutorial.initialize.call(this, [this.grid]);
    }

    NotebookNumbers.prototype.initNewGame = function() {
		if (typeof(this.grid) !== 'undefined')
			this.grid.cleanUpEvents();
        if (typeof(this.tutorial) !== 'undefined')
            this.tutorial.cleanUpEvents();

        this.stage.removeAllChildren();
        var gridWidth = 9;
        this.grid = new Grid(gridWidth);
        this.stage.addChild(this.grid);
        this.stage.addChild(this.refillGridButton);
        this.stage.addChild(this.cells);
        this.stage.addChildAt(this.background, 0);

        // Trigger the numbers updated event
        eventManager.vent.trigger("GRID:RENDER");
        eventManager.vent.trigger("BACKGROUND:RENDER");
    }

    /**
     * Main Loop
     *
     * @method tick
     **/
    NotebookNumbers.prototype.tick = function(evt) {
        this.stage.update();
    }

    /** 
     *  Removes all the cells from the grid and readds an updated version, also checks if each of the cells is in the cursor
     *
     *  @method updateCells
     **/
    NotebookNumbers.prototype.render = function() {
        this.cells.removeAllChildren();
		this.dimensions.update();

		var stageWidth = this.stage.canvas.width;
		var newStageWidth = Math.floor(this.dimensions.fullWidth);
		if (stageWidth !== newStageWidth)
			this.stage.canvas.width = newStageWidth;

		var bindingWidth = 40;
        var width = (this.dimensions.pageWidth - bindingWidth) / config.numColumns;
        var height = config.cellHeight;
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
        var height = config.cellHeight * (this.grid && this.grid.data ? this.grid.data.length : 0) + config.marginTop;
        return height;
    }

    NotebookNumbers.prototype.getBottom = function() {
        var buttonPadding = 65;
        var bottom = this.getHeight() + buttonPadding;
        return Math.max(bottom, 820);
    }

    /**
     * Application Entry Point 
     *
     * @method init
     **/
    function init() {
        // ReSharper disable once WrongExpressionStatement
        new NotebookNumbers();
    }

    window.init = init;
})();
