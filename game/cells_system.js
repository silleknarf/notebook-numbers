var cellsSystem = function(ecs, eventManager) {
	var synchroniseGridEvent = function() {
		ecs.runSystem(
			[componentTypeEnum.GRID],
			function(gridEntity) {
				var gridComponent = gridEntity.components[componentTypeEnum.GRID];
				var grid = gridComponent.grid;
				ecs.removeEntity("cells");
			    // Create each cell and add it to the grid
			    for (var i = 0; i < grid.length; i++) {
			        for (var j = 0; j < grid[i].length; j++) {
			        	var cellWidth = 100/config.numColumns;
			        	var bounds = boundsComponent();
			        	bounds.relative = {
							x: i * cellWidth,
			        		y: j * cellWidth,
			        		width: cellWidth, 
			        		height: cellWidth
			        	};
			        	var number = numberComponent(grid[i][j]);
			        	var cellView = cellViewComponent();
			        	var cellEntity = entity("cells", [bounds, number, cellView])
			        	// TODO: create a grid entity to hold the cells
			            ecs.addEntity("classic", cellEntity);
			        }
			    }
			});
	};

	var initialiseEvents = function() {
		eventManager.vent.on("SYSTEM:LOGIC:GRID_CHANGED", synchroniseGridEvent)
	};
	initialiseEvents();
};