var logicSystem = function(ecs, eventManager, gridUtil) {

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
            gridUtil.refillGrid(grid);
            gridUtil.saveGrid(grid);
        });
    }

    var makeMoveEvent = function(firstCell, secondCell) {
        updateGrid(function(grid) {
            var isMovePossible = gridUtil.check(grid, firstCell, secondCell);
            if (isMovePossible) {
                gridUtil.makeMove(grid, firstCell, secondCell);
                gridUtil.saveGrid(grid);
                
                if (gridUtil.checkCompleted(grid))
                    eventManager.vent.trigger("SYSTEM:LOGIC:GRID_COMPLETED");
            }
        });
    };

    var gridCompletedEvent = function() {
        gridUtil.saveGrid(null);
        var currentLevel = eventManager.vent.trigger("SYSTEM:LEVEL:GET_CURRENT_NUMBER").number;
        var maxLevel = eventManager.vent.trigger("SYSTEM:LEVEL:GET_MAX_NUMBER").number;
        updateGrid(function(grid) {
            var newGrid = [
                "Well done you have",
                "completed level " +  currentLevel + " of ",
                "Notebook Numbers!",
                "Click the new game button",
                "to play the next level.",
                "",
                "Tip: Click the level button to",
                "cycle through the unlocked",
                "levels."
            ];
            if (currentLevel === maxLevel)
            {
                var newGrid = [
                    "Congratulations you have",
                    "completed Notebook Numbers!",
                    "You're an absolute legend!",
                    "Click new game to play again."
                ];
            }
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