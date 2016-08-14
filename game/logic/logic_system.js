var logicSystem = function(ecs, eventManager, gridRepository) {
	var refillGridEvent = function() {
		ecs.runSystem(
			[componentTypeEnum.GRID],
			function(entity) {
				var grid = entity.components[componentTypeEnum.GRID].grid;
				gridRepository.refillGrid(grid);
				eventManager.vent.trigger("SYSTEM:LOGIC:GRID_CHANGED");
			});
	}

	var makeMoveEvent = function(firstCell, secondCell) {
		ecs.runSystem(
			[componentEnumType.GRID],
			function(entity) {
				var grid = entity.components[componentTypeEnum.GRID].grid;
				var isMovePossible = gridRepository.check(grid, firstCell, secondCell);
				if (isMovePossible) {
					gridRepository.makeMove(grid, firstCell, secondCell);
					eventManager.vent.trigger("SYSTEM:LOGIC:GRID_CHANGED");
				}
			});
	};

	var initialiseEvents = function() {
		eventManager.vent.on("SYSTEM:LOGIC:REFILL_GRID", refillGridEvent);
		eventManager.vent.on("SYSTEM:LOGIC:MAKE_MOVE", makeMoveEvent);
	};

	initialiseEvents();
};