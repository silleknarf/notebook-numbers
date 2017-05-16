var tutorialSystem = function(ecs, eventManager) {
	var my = {};

	var init = function() {
		my.tutorialGrid = [];
		my.level = 0;
		nextLevel();

		// If grid completed do next tutorial level
		eventManager.vent.on("SYSTEM:LOGIC:GRID_COMPLETED", nextLevel, my);
	};

	var addTutorialLevel = function(text, grid, height, fontSize) {
		// TODO: Handle text
		if (grid != null) {
			my.tutorialGrid = my.tutorialGrid.concat(grid);
		}
	}

	var updateGrid = function(newGrid) {
		var gridsUpdated = {};
		ecs.runSystem(
			[componentTypeEnum.GRID],
			function(entity) {
				entity.components[componentTypeEnum.GRID].grid = newGrid;
			});
	};

	var refillGridTutorialHelper = function() {
		var gridsUpdated = {};
		ecs.runSystem(
			[componentTypeEnum.GRID],
			function(entity) {
				var grid = entity.components[componentTypeEnum.GRID].grid;
				// if the last number is a five only then the refill grid button should appear
				var bottomRow = grid[grid.length-1];
				if (_.isEqual(bottomRow, [5,0,0,0,0,0,0,0,0])) {
					nextLevel();
					//eventManager.vent.off(Cursor.events.makeMove, this.refillGridTutorialHelper, this);
				}
			});
	}

	var nextLevel = function() {

		my.level += 1;

	    var extendGridByRows = 0;

		// Horizontal Same 
		if (my.level == 1)
			addTutorialLevel(
				"If two numbers are the same, then they can be crossed out", 
				[[0], [1,1]], 
				0);

		// Horizontal spaces
		if (my.level == 2)
			addTutorialLevel(
				"If there is a gap between numbers, then you can play through it", 
				[[0], [4,0,4,5,0,0,5]], 
				2);

		// Horizontal add to 10
		if (my.level == 3)
			addTutorialLevel(
				"If two numbers add to 10, then they can be crossed out", 
				[[0],[2,0,0,8]], 
				4);

		// Vertical add to 10 or same
		if (my.level == 4)
			addTutorialLevel(
				"Two numbers can be beside each other vertically", 
				[[0],[3,0,0,1],[7,0,0,0],[0,0,0,1]], 
				6);

		// New line move twice
		if (my.level == 5) {
			var grid = [[0],[0,0,0,0,0,0,0,8,9],[1,2,0,0,0,0,0,0,0]];
			var hint = "Two numbers are beside each other, from the end of one line to \n\n" + 
				"the start of the next";
			addTutorialLevel(hint, grid, 10);
		}

		// Mini Game
		if (my.level == 6) {
			var grid = [[0], [5,4,3,2,1,9,8,7,6]];
			addTutorialLevel(
				"The aim of the game is to clear the grid", 
				grid, 
				13);
			eventManager.vent.on("SYSTEM:LOGIC:MAKE_MOVE", refillGridTutorialHelper);
		}

		// Refill grid
		if (my.level == 7) {
			eventManager.vent.off("SYSTEM:LOGIC:MAKE_MOVE", refillGridTutorialHelper);

			addTutorialLevel(
				"When there are no more moves to play, you click:", 
				[[]], 
				15);
			// TODO: add refill grid button
		}

		if (my.level == 8)
		{
			// TODO: remove refill grid button
		    extendGridByRows = 2;
			addTutorialLevel(
				"Now you can complete the grid above", 
				null, 
				17);
		}

		// Tutorial Complete
		// Congratulate user, they can now play Notebook Numbers!	
		if (my.level == 9) {
			var hint = "Congratulations, you can now play Notebook Numbers!";
		    extendGridByRows = 3;
			addTutorialLevel(hint, null, 18, 28);
		}

		// TODO: Update the grid properly
		updateGrid(my.tutorialGrid);

		eventManager.vent.trigger("VIEWSYSTEM:CELLS:GRID_CHANGED");
	}

	var initialiseEvents = function() {
		eventManager.vent.on("SYSTEM:MODE:TUTORIAL", init);
	};
	initialiseEvents();
};