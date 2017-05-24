var gridViewSystem = function(ecs, eventManager) {
	var my = {};

	var addCells = function(rowIndex, row) {
        for (var i = 0; i < row.length; i++) {
        	var relativeBounds = {
        		x: i * my.cellWidth,
				y: rowIndex * my.cellHeight,
        		width: my.cellWidth, 
        		height: my.cellHeight
        	};
        	var bounds = boundsComponent(relativeBounds);
        	var cell = cellComponent(rowIndex, i, row[i]);
        	var cellView = cellViewComponent();
        	var cellEntity = entity("cell", [bounds, cell, cellView])
        	my.cells.push(cellEntity);
        	my.topCellHeight = bounds.relative.y + bounds.relative.height;
        }
	};

	var addText = function(rowIndex, row) {
    	var fullWidth = 100;
    	var relativeBounds = {
    		x: 0,
			y: rowIndex * my.cellHeight,
    		width: fullWidth, 
    		height: my.cellHeight
    	};
    	var bounds = boundsComponent(relativeBounds);
    	var textView = textViewComponent();
    	var text = textComponent(row);
    	var textEntity = entity("text", [bounds, text, textView])
    	my.texts.push(textEntity);
    	my.topCellHeight = bounds.relative.y + bounds.relative.height;
	};

	var synchroniseGrid = function(gridEntity) {
		var gridComponent = gridEntity.components[componentTypeEnum.GRID];
		var grid = gridComponent.grid;

		var previousGridRows = gridEntity.subEntities.length/config.numColumns;
		var gridRows = grid.length;

		ecs.removeEntities("cell");
		ecs.removeEntities("text");
	    // Create each cell and add it to the grid
	    my.topCellHeight = null;
	    my.cells = [];
	    my.texts = [];

    	var gridWidth = 180;
    	var gridHeight = 100;
    	my.cellWidth = gridWidth/config.numColumns;
    	my.cellHeight = gridHeight/config.numRows;

	    for (var i = 0; i < grid.length; i++) {
	    	if (Array.isArray(grid[i]))
	    		addCells(i, grid[i]);
	    	else 
	    		addText(i, grid[i]);
	    }

	    // Not sure why so much space is required here
	    var rowHeight = gridHeight/config.numRows;
	    var fiveRows = 5 * rowHeight;

		var relativeGridHeight = gridEntity
			.parent
			.parent
			.components[componentTypeEnum.BOUNDS]	
			.relative
			.height;
		eventManager.vent.trigger(
			"SYSTEM:BOUNDS:UPDATE_MAX_HEIGHT", 
			my.topCellHeight + fiveRows, 
			relativeGridHeight);

		eventManager.vent.trigger(
			"SYSTEM:BOUNDS:MOVE", 
			"refill_grid", 
			null, 
			my.topCellHeight + rowHeight);

	   	ecs.addEntities("grid", my.cells);
	   	ecs.addEntities("grid", my.texts);

	   	eventManager.vent.trigger("SYSTEM:BOUNDS:UPDATE");
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