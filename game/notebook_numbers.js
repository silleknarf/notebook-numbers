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
		console.log("Inital width: "+this.stage.canvas.width+"px");


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

        this.background = new BackgroundView(this.assets, this.dimensions);
        this.refillGridButton = new RefillGridButton(this.dimensions);

        var context = this;
        this.stage.onPress = function(evt) {
            context.dimensions.mousedown(evt);
            evt.onMouseUp = function(evt) {
                context.dimensions.mouseup(evt);
            };
        };

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

        this.tutorial.initialize.call(this, [this.dimensions]);
    }

    NotebookNumbers.prototype.initNewGame = function() {
		if (typeof(this.grid) !== 'undefined')
			this.grid.cleanUpEvents();
        if (typeof(this.tutorial) !== 'undefined')
            this.tutorial.cleanUpEvents();

        this.stage.removeAllChildren();
        var gridWidth = 9;
        this.grid = new Grid(gridWidth, this.dimensions);
        this.dimensions.gridHeight = this.grid.length;
        this.stage.addChild(this.grid);
        this.stage.addChild(this.refillGridButton);
        this.stage.addChild(this.cells);
        this.stage.addChildAt(this.background, 0);

        // Trigger the numbers updated event
        eventManager.vent.trigger("GRID:RENDER");
        eventManager.vent.trigger("BACKGROUND:RENDER");
    }

    NotebookNumbers.prototype.tick = function(evt) {
        this.stage.update();
    }

    /** 
     *  Removes all the cells from the grid and readds an updated version, also checks if each of the cells is in the cursor
     *
     *  @method render
     **/
    NotebookNumbers.prototype.render = function() {
        this.cells.removeAllChildren();
        this.dimensions.gridHeight = this.grid.data.length;
		this.dimensions.update();

		var stageWidth = this.stage.canvas.width;
		var newStageWidth = Math.floor(this.dimensions.fullWidth);
		if (stageWidth !== newStageWidth)
			this.stage.canvas.width = newStageWidth;

		var bindingWidth = this.dimensions.isVerticalLayout ? 0 : 40;
        var width = (this.dimensions.pageWidth - bindingWidth) / config.numColumns;
        var height = config.cellHeight;
        var grid = this.grid.data;
        var cursor = this.grid.cursor.cells;

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
})();
