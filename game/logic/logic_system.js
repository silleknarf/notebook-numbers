var logicSystem = function(ecs, eventManager, gridRepository) {
	var refillGridEvent = function() {
		var gridsUpdated = {};
		ecs.runSystem(
			[componentTypeEnum.GRID],
			function(entity) {
				var grid = entity.components[componentTypeEnum.GRID].grid;

				// We update each grid only once
				if (gridsUpdated[grid.id] === true)
					return;
				gridsUpdated[grid.id] = true;

				gridRepository.refillGrid(grid);
				eventManager.vent.trigger("VIEWSYSTEM:CELLS:GRID_CHANGED");
			});
	}

	var makeMoveEvent = function(firstCell, secondCell) {
		var gridsUpdated = {};
		ecs.runSystem(
			[componentEnumType.GRID],
			function(entity) {
				var grid = entity.components[componentTypeEnum.GRID].grid;

				// We update each grid only once
				if (gridsUpdated[grid.id] === true)
					return;
				gridsUpdated[grid.id] = true;

				var isMovePossible = gridRepository.check(grid, firstCell, secondCell);
				if (isMovePossible) {
					gridRepository.makeMove(grid, firstCell, secondCell);
					eventManager.vent.trigger("VIEWSYSTEM:CELLS:GRID_CHANGED");
				}
			});
	};

	var initialiseEvents = function() {
		eventManager.vent.on("SYSTEM:LOGIC:REFILL_GRID", refillGridEvent);
		eventManager.vent.on("SYSTEM:LOGIC:MAKE_MOVE", makeMoveEvent);
	};

	initialiseEvents();
};