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

        // Enable touch screen support
        //createjs.Touch.enable(this.stage);

        // Enable fast cursor
        this.stage.enableMouseOver();

        this.cells = new createjs.Container();

        // Setup stats update
        eventManager.vent.on("STATS:UPDATE", this.updateStats, this);

        // Drawing Events
        eventManager.vent.on("GRID:NUMBERS_UPDATED", this.updateCells, this);

        // Preload the images
        this.assets = [];
        this.loadImages();
    }

    /**
     * Preloads the images that are used for the game
     *
     * @method loadImages
     **/
    NotebookNumbers.prototype.loadImages = function() {
        var manifest = [
            { src: 'game/img/scribble.png', id: 'scribble' },
            { src: 'game/img/tile.png', id: 'background' },
            { src: 'game/img/bindings.png', id: 'bindings' },
        ];
        for (var i = 1; i <= 9; i++) {
            var digit = i;
            var image = 'game/img/' + digit + '.png';
            manifest.push({ src: image, id: digit });
        }
        // Create an image loader with handlers
        var loader = new createjs.LoadQueue();
        var that = this;
        loader.addEventListener("fileload", function(ev) {
            return that.handleFileLoad.call(that, ev);
        });
        loader.addEventListener("complete", function(ev) {
            return that.handleComplete.call(that, ev);
        });
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
        this.assets[event.item.id] = event.result;
    }

    /**
     *  Callback function for when the images have all been loaded
     *
     *  @method handleComplete
     **/
    NotebookNumbers.prototype.handleComplete = function() {
        // Log the preloaded files for now
        for (var i = 0; i < this.assets.length; i++) 
        {
            var item = this.assets[i]; 
            console.log(item);
        }
        // Start the game
        this.initGame();
    };

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
        this.background = new BackgroundView(getHeightFunc, this.assets);

        // Add the refill grid button
        this.refillGridButton = new RefillGridButton(config.width, getHeightFunc);

        // Now we can start the main loop
        createjs.Ticker.setFPS(25);
        createjs.Ticker.addListener(this);

        eventManager.vent.on("NOTEBOOKNUMBERS:TUTORIAL", this.initTutorial, this);
        eventManager.vent.on("NOTEBOOKNUMBERS:NEWGAME", this.initNewGame, this);

        createjs.EventDispatcher.initialize(NotebookNumbers.prototype);

        //eventManager.vent.trigger("NOTEBOOKNUMBERS:TUTORIAL");
        //eventManager.vent.trigger("NOTEBOOKNUMBERS:TUTORIAL");
        eventManager.vent.trigger("NOTEBOOKNUMBERS:NEWGAME");
    }

    NotebookNumbers.prototype.initTutorial = function() {
        if (this.grid)
            this.grid.cleanUpEvents();
        eventManager.vent.off("GRID:COMPLETED", this.congratulate, this);

        this.tutorial = {};
        this.tutorial.__proto__ = Tutorial.prototype;
        _.extend(this, this.tutorial);

        this.tutorial.initialize.call(this, [this.grid]);
    }

    NotebookNumbers.prototype.initNewGame = function() {
        if (this.grid)
            this.grid.cleanUpEvents();
        if (this.tutorial)
            this.cleanUpEvents();

        eventManager.vent.on("GRID:COMPLETED", this.congratulate, this);

        this.stage.removeAllChildren();
        var gridWidth = 9;
        this.grid = new Grid(gridWidth);
        this.stage.addChild(this.grid);
        this.stage.addChild(this.refillGridButton);
        this.stage.addChild(this.cells);
        this.stage.addChildAt(this.background, 0);

        // Trigger the numbers updated event
        eventManager.vent.trigger("GRID:NUMBERS_UPDATED");
        eventManager.vent.trigger("GRID:HEIGHT_UPDATED");
    }

    NotebookNumbers.prototype.congratulate = function() {
        this.stage.removeAllChildren();
        this.stage.addChildAt(this.background, 0);

		// Draw the title banderole on the right hand side
	    var congratulationsTextFontSize = 50;
        var coverMargin = 10;
        var padding = 30;
        var text = "Congratulations, you have achieved Notebook Numbers greatness! Please reward yourself with a cup of tea or your personal beverage of choice.";
		var congratulationsText = new createjs.Text(text, congratulationsTextFontSize+"px Yellowtail", config.navy);
		congratulationsText.x = config.width/2;
		congratulationsText.y = coverMargin+50; 
        congratulationsText.lineWidth = config.width-padding*2;
		congratulationsText.textAlign = "center";

		this.stage.addChild(congratulationsText);
    }

    NotebookNumbers.prototype.initTimeTrial = function() {
        this.time = 60;
        this.score = 0;
        this.finalScore = 0;
        this.divider = 1;
        eventManager.vent.on("CURSOR:MAKE_MOVE", this.moveMade, this);
        //eventManager.vent.on("REFILL_GRID", this.refillGrid, this);
        eventManager.vent.on("STATS:PERCENTAGE_CLEARED", this.percentCleared, this);

        config.overview = new createjs.Text("", "22px " + config.font, config.navy);
        this.updateStats();
        eventManager.vent.trigger("GRID:NUMBERS_UPDATED");
    }

    NotebookNumbers.prototype.moveMade = function() {
        this.score += 100;
    }

    NotebookNumbers.prototype.percentCleared = function(percentageCleared) {
        this.divider += percentageCleared;
    }

    NotebookNumbers.prototype.updateStats = function() {

        var score = (this.score / this.divider).toFixed(0);
        if (this.time < 0 && this.finalScore == 0) {
            this.finalScore = score;
        }

        var time = this.time;
        var stats;
        if (this.time < 0) {
            score = this.finalScore;
            stats = "TIME UP!\n\n\n";
            stats += "FINAL SCORE:\n\n " + score;
        } else {
            stats = "TIME REMAINING:\n\n " + time + "\n\n\n";
            stats += "SCORE:\n\n " + score;
        }

        this.stage.removeChild(this.overview);
        this.overview = new createjs.Text(stats, "30px " + this.font, this.navy);
        this.overview.x = this.marginLeft + this.width + 60;
        this.overview.y = this.marginTop + 20;
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
            this.time -= 1 / 25;
        //this.time = this.time.toFixed(3);
        //eventManager.vent.trigger("STATS:UPDATE");
    }

    /** 
     *  Removes all the cells from the grid and readds an updated version, also checks if each of the cells is in the cursor
     *
     *  @method updateCells
     **/
    NotebookNumbers.prototype.updateCells = function() {
        this.cells.removeAllChildren();
        var width = config.width / config.numColumns;
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