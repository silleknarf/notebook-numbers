var cellsViewSystem = function(ecs, eventManager) {

	var synchroniseGrid = function(gridEntity) {
		var gridComponent = gridEntity.components[componentTypeEnum.GRID];
		var grid = gridComponent.grid;

		var previousGridRows = gridEntity.subEntities.length/config.numColumns;
		var gridRows = grid.length;

		ecs.removeEntities("cell");
	    // Create each cell and add it to the grid
	    var topCellHeight = null;
	    var cells = [];
	    for (var i = 0; i < grid.length; i++) {
	        for (var j = 0; j < grid[i].length; j++) {
	        	var gridWidth = 180;
	        	var gridHeight = 100;
	        	var cellWidth = gridWidth/config.numColumns;
	        	var cellHeight = gridHeight/config.numRows;
	        	var relativeBounds = {
	        		x: j * cellWidth,
					y: i * cellHeight,
	        		width: cellWidth, 
	        		height: cellHeight
	        	};
	        	var bounds = boundsComponent(relativeBounds);
	        	var cell = cellComponent(i, j, grid[i][j]);
	        	var cellView = cellViewComponent();
	        	var cellEntity = entity("cell", [bounds, cell, cellView])
	        	cells.push(cellEntity);
	        	topCellHeight = bounds.relative.y + bounds.relative.height;
	        }
	    }

	    // Not sure why so much space is required here
	    var rowHeight = (100/config.numRows)
	    var fourRows = 4 * rowHeight;
		eventManager.vent.trigger("SYSTEM:BOUNDS:UPDATE_MAX_HEIGHT", topCellHeight + fourRows);
		eventManager.vent.trigger("SYSTEM:BOUNDS:MOVE", "refillGrid", null, topCellHeight + rowHeight);

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