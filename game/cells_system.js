var cellsSystem = function(ecs, eventManager) {
	var synchroniseGridEvent = function() {
		ecs.runSystem(
			[componentTypeEnum.GRID],
			function(gridEntity) {
				var gridComponent = gridEntity.components[componentTypeEnum.GRID];
				var grid = gridComponent.grid;
				ecs.removeEntity("cells");
			    // Create each cell and add it to the grid
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
			        	var number = numberComponent(grid[i][j]);
			        	var cellView = cellViewComponent();
			        	var cellEntity = entity("cells", [bounds, number, cellView])
			        	cells.push(cellEntity);
			        }
			    }
			  	// TODO: create a grid entity to hold the cells
			   	ecs.addEntities("classic", cells);
			});
	};

	var initialiseEvents = function() {
		eventManager.vent.on("SYSTEM:LOGIC:GRID_CHANGED", synchroniseGridEvent)
	};
	initialiseEvents();
};