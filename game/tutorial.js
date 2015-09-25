/**
 * @module NotebookNumbers
 **/
(function() {

	var Tutorial = function(dimensions) {
	    this.dimensions = dimensions;
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
		this.grid = new Grid(gridWidth, this.dimensions);
		this.stage.addChild(this.grid);
		this.stage.addChild(this.cells);
		this.stage.addChildAt(this.background, 0);

		// Add text to help
		var controls = "HIGHLIGHT:\n\n Hover over number\n\n\n";
		controls += "SELECT MODE OR CROSS OUT:\n\n Click once on the number";
	    var overviewFontSize = 22 * this.dimensions.fontScalingFactor;
		var overview = new createjs.Text(controls, overviewFontSize+"px "+config.font, config.navy);
		overview.x = config.marginLeft+this.dimensions.pageWidth+60;
		overview.y = config.marginTop+20;
		overview.lineWidth = 350;
		this.stage.addChild(overview);

		// Setup tutorial
		this.tutorialGrid = [];
		this.level = 0;
		this.nextLevel();

		// If grid completed do next tutorial level
		eventManager.vent.on(Grid.events.completed, this.nextLevel, this);

		// Trigger the numbers updated event
		eventManager.vent.trigger(Grid.events.render);
		eventManager.vent.trigger(BackgroundView.events.render);
	}

	Tutorial.prototype.cleanUpEvents = function ()
	{
		eventManager.vent.off(Grid.events.completed, this.nextLevel, this);
		eventManager.vent.off(Cursor.events.makeMove, this.refillGridTutorialHelper, this);
	}

	Tutorial.prototype.nextLevel = function() {

		this.level += 1;

	    var extendGridByRows = 0;

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
			eventManager.vent.on(Cursor.events.makeMove, this.refillGridTutorialHelper, this);
		}

		// Refill grid
		if (this.level == 7) {
			this.addTutorialLevel("When there are no more moves to play, you click:", [[]], 15);
			this.stage.addChild(this.refillGridButton);
			this.refillGridButton.y = 30 + this.dimensions.getHeight();
		}

		if (this.level == 8)
		{
			eventManager.vent.off(Grid.events.refill, this.nextLevel, this);
		    this.stage.removeChild(this.refillGridButton);
		    extendGridByRows = 2;
			this.addTutorialLevel("Now you can complete the grid above", null, 17);
		}

		// Tutorial Complete
		// Congratulate user, they can now play Notebook Numbers!	
		if (this.level == 9) {
			var hint = "Congratulations, you can now play Notebook Numbers!";
		    extendGridByRows = 3;
			this.addTutorialLevel(hint, null, 18, 28);
		}

		this.grid.data = this.tutorialGrid;

		eventManager.vent.trigger(Grid.events.render);

		this.dimensions.gridHeight = this.dimensions.isVerticalLayout 
            ? this.tutorialGrid.length + extendGridByRows
            : this.tutorialGrid.length;

		eventManager.vent.trigger(BackgroundView.events.render);
	}

	Tutorial.prototype.refillGridTutorialHelper = function() {
		// if the last number is a five only then the refill grid button should appear
		var bottomRow = this.grid.data[this.grid.data.length-1];
		if (_.isEqual(bottomRow, [5,0,0,0,0,0,0,0,0])) {
			this.nextLevel();
			eventManager.vent.off(Cursor.events.makeMove, this.refillGridTutorialHelper, this);
		}
	}

	Tutorial.prototype.addTutorialLevel = function(text, grid, height, fontSize) {
		var marginLeft = 10;
	    var multiplier = this.dimensions.isVerticalLayout ? 2 : 1;
	    fontSize = typeof fontSize !== 'undefined'
            ? fontSize * this.dimensions.fontScalingFactor * multiplier
            : 24 * this.dimensions.fontScalingFactor * multiplier;
		
		var sameNumber = new createjs.Text(text, fontSize+"px "+config.font, config.navy);
		sameNumber.x = config.marginLeft+marginLeft;
		sameNumber.y = this.dimensions.getTop() + config.marginTop+config.cellHeight*height;
		this.stage.addChild(sameNumber);
		if (grid != null) {
			this.tutorialGrid = this.tutorialGrid.concat(grid);
		}
	}

	window.Tutorial = Tutorial;
})();
