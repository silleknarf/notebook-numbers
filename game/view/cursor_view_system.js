var cursorViewSystem = function(ecs, eventManager) {

	var getCellsHelper = function(entities) {
		return _.flatten(entities, 
			function(entity) {
				if (entity.hasRequiredComponents([componentTypeEnum.CELL]))
					return getCellsHelper(entity.subEntities);
				return [];
		 	});
	};

	var getCells = function(entity) {
		return getCellsHelper([entity]);
	}

	// We traverse the grid entity to get all of the cell entities underneath
	// the is then used to update the bounds of the cursor cells
	var updateCursorBounds = function(cursorCell, cellEntities) {
		_.filter(cellEntities, function(cellEntity) {
			var cell = cellEntity.components[componentTypeEnum.CELL];
			if (cell.i === cursor.cells[0].i && 
				cell.j === cursor.cells[0].j)
				cursor.cells[0][componentTypeEnum.BOUNDS] = cellEntity.components[componentTypeEnum.BOUNDS];
			if (cell.i === cursor.cells[1].i && 
				cell.j === cursor.cells[1].j)
				cursor.cells[1][componentTypeEnum.BOUNDS] = cellEntity.components[componentTypeEnum.BOUNDS];
		});
	}

	var synchroniseCursor = function(gridEntity) {
		var cellEntities = getCells(entity);

		updateCursorBounds(cursor.cells[0], cellEntities);
		updateCursorBounds(cursor.cells[1], cellEntities);
	};

	var synchroniseCursorEvent = function() {
		ecs.runSystem(
			[componentTypeEnum.GRID],
			function(gridEntity) {
				synchroniseGrid(gridEntity);
			});
	};

	var initialiseEvents = function() {
		eventManager.vent.on("VIEWSYSTEM:CURSOR:UPDATED", synchroniseCursorEvent);
	};
	initialiseEvents();
};