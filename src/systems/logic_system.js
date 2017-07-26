var logicSystem = function(ecs, eventManager, gridRepository) {

    var updateGrid = function(gridUpdateFunc) {
        var gridsUpdated = {};
        ecs.runSystemOnce(
            [componentTypeEnum.GRID],
            function(entity) {
                var grid = entity.components[componentTypeEnum.GRID].grid;

                // We update each grid only once
                if (gridsUpdated[grid.id] === true)
                    return;
                gridsUpdated[grid.id] = true;

                gridUpdateFunc(grid);
            });

        eventManager.vent.trigger("VIEWSYSTEM:CELLS:GRID_CHANGED");
    };

    var refillGridEvent = function() {
        updateGrid(function(grid) {
            gridRepository.refillGrid(grid);
            gridRepository.saveGrid(grid);
        });
    }

    var makeMoveEvent = function(firstCell, secondCell) {
        updateGrid(function(grid) {
            var isMovePossible = gridRepository.check(grid, firstCell, secondCell);
            if (isMovePossible) {
                gridRepository.makeMove(grid, firstCell, secondCell);
                gridRepository.saveGrid(grid);
                
                if (gridRepository.checkCompleted(grid))
                    eventManager.vent.trigger("SYSTEM:LOGIC:GRID_COMPLETED");
            }
        });
    };

    var gridCompletedEvent = function() {
        gridRepository.saveGrid(null);
        updateGrid(function(grid) {
            var newGrid = [
                "Congratulations you have",
                "completed Notebook Numbers!",
                "You're an absolute legend!",
                "Click new game to play again."
            ];
            // Replace the grid without updating the reference
            grid.length = 0;
            Array.prototype.push.apply(grid, newGrid);
        });
        ecs.removeEntities("refill_grid");
    };

    var initialiseEvents = function() {
        eventManager.vent.on("SYSTEM:LOGIC:REFILL_GRID", refillGridEvent);
        eventManager.vent.on("SYSTEM:LOGIC:MAKE_MOVE", makeMoveEvent);
        eventManager.vent.on("SYSTEM:LOGIC:GRID_COMPLETED", gridCompletedEvent);
    };

    initialiseEvents();
};