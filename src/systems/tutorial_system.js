var tutorialSystem = function(ecs, eventManager) {
	var my = {};

	var init = function() {
		my.tutorialGrid = [];
		my.level = 0;
		nextLevel();

		// If grid completed do next tutorial level
		eventManager.vent.on("SYSTEM:LOGIC:GRID_COMPLETED", nextLevel, my);
	};

	var addTutorialLevel = function(grid) {
		my.tutorialGrid = grid; 
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
				}
			});
	}

	var getTutorialLevel = function(texts, numberLines) {
		var text = texts.join("\n\n");
		var emptyLinesCount = config.isVerticalLayout 
			? Math.floor((texts.length-1)/2) 
			: texts.length;
		var emptyLines = _.times(emptyLinesCount, function() { return []; });
		return [text].concat(emptyLines).concat(numberLines);
	};

	var nextLevel = function() {

		my.level += 1;

	    var extendGridByRows = 0;

		// Horizontal Same and controls
		if (my.level == 1) { 

			my.tutorialGrid = []

			// If we are playing the desktop version we provide some extra help
			var text = [];
			if (!config.isVerticalLayout) { 
				var clickHelp = ["Clicking on a number holds", 
					"the cursor in place and",
					"hovering over the number", 
					"adds the number to the cursor.", 
					"Clicking crosses out a number."];
				text = clickHelp;
			}

			text = text.concat(["If two numbers are the same,", 
				"then they can be crossed out."]);
			my.tutorialGrid = getTutorialLevel(text, [[1,1]]);
		}

		// Horizontal spaces
		if (my.level == 2) 
			my.tutorialGrid = getTutorialLevel(
				["If there are any numbers in", 
				"between then you can't cross out.", 
				"But, if there is a gap between", 
				"numbers then you can play ", 
				"through it"],
				[[4,0,4,5,0,0,5]]);

		// Horizontal add to 10
		if (my.level == 3)
			my.tutorialGrid = getTutorialLevel(
				["If two numbers add to 10,", 
				"then they can be crossed out."],
				[[2,0,0,8]]);

		// Vertical add to 10 or same
		if (my.level == 4)
			my.tutorialGrid = getTutorialLevel(
				["Two numbers can be beside each", 
				"other vertically."], 
				[[3,0,0,1],[7,0,0,0],[0,0,0,1]]);

		// New line move twice
		if (my.level == 5) {
			var text = ["Two numbers are beside each", 
				"other, from the end of one line",
				"to the start of the next."];
			var numberLines = [[0,0,0,0,0,0,0,8,9],[1,2,0,0,0,0,0,0,0]];
			my.tutorialGrid = getTutorialLevel(text, numberLines);
		}

		// Mini Game
		if (my.level == 6) {
			my.tutorialGrid = getTutorialLevel(
				["The aim of the game is", "to clear the grid."],
				[[5,4,3,2,1,9,8,7,6]]);
			eventManager.vent.on("SYSTEM:LOGIC:MAKE_MOVE", refillGridTutorialHelper);
		}

		// Refill grid
		if (my.level == 7) {
			eventManager.vent.off("SYSTEM:LOGIC:MAKE_MOVE", refillGridTutorialHelper);

			my.tutorialGrid = my.tutorialGrid.concat(
				["When there are no more moves to\n\nplay you click:", [], []]);

			var refillGridEntity = refillGridEntityFactory();
			ecs.addEntities("tutorial", [refillGridEntity]);
			eventManager.vent.on("SYSTEM:LOGIC:REFILL_GRID", nextLevel);
		}

		if (my.level == 8)
		{
			my.tutorialGrid = my.tutorialGrid.concat(
				["Now you can complete\n\nthe grid above."]);
			ecs.removeEntities("refill_grid");
		}

		// Tutorial Complete
		// Congratulate user, they can now play Notebook Numbers!	
		if (my.level == 9) {
			var hint = ["Congratulations, you can now", "play Notebook Numbers!"];
			var nextStep = ["Click the \"New Game\" button", "to play a game"];
			var text = hint.concat(nextStep);
			my.tutorialGrid = getTutorialLevel(text);
			localStorage.setItem("hasCompletedTutorial", true);
		}

		updateGrid(my.tutorialGrid);

		eventManager.vent.trigger("VIEWSYSTEM:CELLS:GRID_CHANGED");
	}

	var dispose = function() {
		eventManager.vent.off("SYSTEM:LOGIC:MAKE_MOVE", refillGridTutorialHelper);
		eventManager.vent.off("SYSTEM:LOGIC:GRID_COMPLETED", nextLevel, my);
		eventManager.vent.off("SYSTEM:LOGIC:REFILL_GRID", nextLevel);
		ecs.removeEntities("refill_grid");
	}

	var initialiseEvents = function() {
		eventManager.vent.on("SYSTEM:MODE:TUTORIAL", init);
		eventManager.vent.on("SYSTEM:MODE:CHANGE_MODE", dispose);
	};
	initialiseEvents();
};