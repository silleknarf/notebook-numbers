var cellsViewSystem = function(ecs, eventManager) {

	var synchroniseGrid = function(gridEntity) {
		var gridComponent = gridEntity.components[componentTypeEnum.GRID];
		var grid = gridComponent.grid;
		ecs.removeEntities("cell");
	    // Create each cell and add it to the grid
	    var topCellHeight = null;
	    var cells = [];
	    for (var i = 0; i < grid.length; i++) {
	        for (var j = 0; j < grid[i].length; j++) {
	        	var gridWidth = 46;
	        	var gridOffset = 4;
	        	var cellWidth = gridWidth/config.numColumns;
	        	var bounds = boundsComponent();
	        	bounds.relative = {
	        		x: j * cellWidth + gridOffset,
					y: i * cellWidth + gridOffset,
	        		width: cellWidth, 
	        		height: cellWidth
	        	};
	        	var cell = cellComponent(i, j, grid[i][j]);
	        	var cellView = cellViewComponent();
	        	var cellEntity = entity("cell", [bounds, cell, cellView])
	        	cells.push(cellEntity);
	        	topCellHeight = bounds.relative.y + bounds.relative.height;
	        }
	    }
		var gridBounds = gridEntity.components[componentTypeEnum.BOUNDS];
		var updatedBoundsComponent = _.cloneDeep(gridBounds);
		updatedBoundsComponent.relative.height = topCellHeight;
		eventManager.vent.trigger("SYSTEM:BOUNDS:RESIZE", updatedBoundsComponent);

	   	ecs.addEntities("grid", cells);
	};

	var synchroniseGridEvent = function() {
		ecs.runSystem(
			[componentTypeEnum.GRID, componentTypeEnum.BOUNDS],
			function(gridEntity) {
				synchroniseGrid(gridEntity);
			});
	};

	var initialiseEvents = function() {
		eventManager.vent.on("VIEWSYSTEM:CELLS:GRID_CHANGED", synchroniseGridEvent)
	};
	initialiseEvents();
};