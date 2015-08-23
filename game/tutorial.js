/**
 * @module NotebookNumbers
 **/
(function() {

	var Tutorial = function() {
		this.initialize();
	}

	var p = Tutorial.prototype = new createjs.Container();
	p.Container_initialize = p.initialize;

	p.initialize = function() {
	    console.log("tutorial:initialize");

        // Setup the display properties of the grid
        this.stage.removeAllChildren();
        var gridWidth = 9;
        this.cells = new createjs.Container();
        this.grid = new Grid(gridWidth);
	    this.stage.addChild(this.grid);
        this.stage.addChild(this.cells);
        this.stage.addChildAt(this.background, 0);

		// Add text to help
		var controls = "HIGHLIGHT:\n\n Hover over number\n\n\n";
		controls += "SELECT MODE OR CROSS OUT:\n\n Click once on the number";
		var overview = new createjs.Text(controls, "22px "+config.font, config.navy);
		overview.x = config.marginLeft+config.width+60;
		overview.y = config.marginTop+20;
		overview.lineWidth = 350;
		this.stage.addChild(overview);

		// Setup tutorial
		this.tutorial = [];
		this.level = 0;
		this.nextLevel();

		// If grid completed do next tutorial level
		eventManager.vent.on("GRID:COMPLETED", this.nextLevel, this);

        // Trigger the numbers updated event
        eventManager.vent.trigger("GRID:NUMBERS_UPDATED");
        eventManager.vent.trigger("GRID:HEIGHT_UPDATED");
	}

	Tutorial.prototype.cleanUpEvents = function() {
		eventManager.vent.off("GRID:COMPLETED", this.nextLevel, this);
		eventManager.vent.off("CURSOR:MAKE_MOVE", this.refillGridTutorialHelper, this);
    }

	Tutorial.prototype.nextLevel = function() {

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
			var hint = "Two numbers are beside each other, from the end of one line to \n\nthe start of the next";
			this.addTutorialLevel(hint, grid, 10);
		}

		// Mini Game
		if (this.level == 6) {
			var grid = [[0], [5,4,3,2,1,9,8,7,6]];
			this.addTutorialLevel("The aim of the game is to clear the grid", grid, 13);
			eventManager.vent.on("CURSOR:MAKE_MOVE", this.refillGridTutorialHelper, this);
		}

		// Refill grid
		if (this.level == 7) {
		    this.addTutorialLevel("When there are no more moves to play, you click:", [[0]], 15);
			this.stage.addChild(this.refillGridButton);
			eventManager.vent.on("REFILL_GRID", this.nextLevel, this);
		}

		if (this.level == 8)
		{
			eventManager.vent.off("REFILL_GRID", this.nextLevel, this);
			this.addTutorialLevel("Now you can complete the grid above", null, 17);
		}

		// Tutorial Complete
		// Congratulate user, they can now play Notebook Numbers!	
		if (this.level == 9) {
			var hint = "Congratulations, you can now play Notebook Numbers!";
			this.addTutorialLevel(hint, null, 18, 28);
		}
		
		this.grid.data = this.tutorial;

		eventManager.vent.trigger("GRID:NUMBERS_UPDATED");
		eventManager.vent.trigger("GRID:HEIGHT_UPDATED");
	}

	Tutorial.prototype.refillGridTutorialHelper = function() {
		// if the last number is a five only then the refill grid button should appear
		var bottomRow = this.grid.data[this.grid.data.length-1];
		if (_.isEqual(bottomRow, [5,0,0,0,0,0,0,0,0])) {
			this.nextLevel();
			eventManager.vent.off("CURSOR:MAKE_MOVE", this.refillGridTutorialHelper, this);
		}
	}

	Tutorial.prototype.addTutorialLevel = function(text, grid, height, fontSize) {
		var marginLeft = 10;
		fontSize = typeof fontSize !== 'undefined' ? fontSize : 24;
		
		var sameNumber = new createjs.Text(text, fontSize+"px "+config.font, config.navy);
		sameNumber.x = config.marginLeft+marginLeft;
		sameNumber.y = config.marginTop+config.cellHeight*height;
		this.stage.addChild(sameNumber);
		if (grid != null) {
			this.tutorial = this.tutorial.concat(grid);
		}
	}

	window.Tutorial = Tutorial;
})();
