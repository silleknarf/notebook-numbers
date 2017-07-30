var gridViewSystem = function(ecs, eventManager) {
    var my = {};

    var removeOldEntities = function(entitiesToRemove) {
        var flattenedEntitiesToRemove = _(entitiesToRemove)
            .flatten()
            .filter(function(entityToRemove) {
                return typeof entityToRemove !== "undefined";
            })
            .value();
        ecs.removeEntitiesById(flattenedEntitiesToRemove);
    }

    var upsertCells = function(rowIndex, row, previousRow, isNewRowType) {
        var bounds;
        for (var i = 0; i < row.length; i++) {
            var isNewCellForRow = typeof previousRow !== "undefined" && typeof previousRow[i] === "undefined";
            var shouldInsertNewCell = isNewRowType || isNewCellForRow;
            // We're adding new numbers
            if (shouldInsertNewCell) {
                var relativeBounds = {
                    x: i * my.cellWidth,
                    y: rowIndex * my.cellHeight,
                    width: my.cellWidth, 
                    height: my.cellHeight
                };
                bounds = boundsComponent(relativeBounds);
                var cell = cellComponent(rowIndex, i, row[i]);
                var cellView = cellViewComponent();
                var cellEntity = entity("cell", [bounds, cell, cellView])
                my.cells.push(cellEntity);
            // We're updating existing numbers
            } else {
                bounds = previousRow[i].components[componentTypeEnum.BOUNDS];
                bounds.relative.x = i * my.cellWidth;
                bounds.relative.y = rowIndex * my.cellHeight;
                var cell = previousRow[i].components[componentTypeEnum.CELL];
                cell.digit = row[i];
            }
        }
        my.topCellHeight = bounds.relative.y + bounds.relative.height;
    };

    var upsertText = function(rowIndex, row, previousRow, isNewRowType) {
        var bounds;
        // We're adding new text
        if (isNewRowType) {
            var fullWidth = 100;
            var relativeBounds = {
                x: 0,
                y: rowIndex * my.cellHeight,
                width: fullWidth, 
                height: my.cellHeight
            };
            bounds = boundsComponent(relativeBounds);
            var textView = textViewComponent();
            var text = textComponent(rowIndex, row);
            var textEntity = entity("text", [bounds, text, textView])
            my.texts.push(textEntity);
        // We're updating existing text
        } else {
            bounds = previousRow.components[componentTypeEnum.BOUNDS];
            bounds.relative.x = 0;
            bounds.relative.y = rowIndex * my.cellHeight;
            previousRow.components[componentTypeEnum.TEXT].text = row;
        }

        my.topCellHeight = bounds.relative.y + bounds.relative.height;
    };

    // Convert the existing grid into a 2d array
    var getPreviousGridRows = function(gridSubEntities) {
        var grid = [];
        _.forEach(
            gridSubEntities,
            function(gridSubEntity) {
                if (gridSubEntity.name === "cell") {
                    var cell = gridSubEntity.components[componentTypeEnum.CELL];
                    var i = cell.i;
                    var j = cell.j;
                    if (typeof grid[i] === "undefined") {
                        grid[i] = [];
                    }
                    grid[i][j] = gridSubEntity;
                }
                if (gridSubEntity.name === "text") {
                    var i = gridSubEntity.components[componentTypeEnum.TEXT].i;
                    grid[i] = gridSubEntity;
                }
            });
        return grid;
    }

    var synchroniseGrid = function(gridEntity) {
        var gridComponent = gridEntity.components[componentTypeEnum.GRID];
        var grid = gridComponent.grid;

        var previousGridRows = gridEntity.subEntities.length/config.numColumns;
        var gridRows = grid.length;

        var previousGridRows = getPreviousGridRows(gridEntity.subEntities);

        // Create each cell and add it to the grid
        my.topCellHeight = null;
        my.cells = [];
        my.texts = [];

        var gridWidth = 180;
        var gridHeight = 100;
        my.cellWidth = gridWidth/config.numColumns;
        my.cellHeight = gridHeight/config.numRows;

        var entitiesToRemove = [];
        var row = 0;
        // We go through the longest of the previous and the new grids
        for (var i = 0; i < grid.length || i < previousGridRows.length; i++) {

            // We remove any no-longer-needed rows
            if (i >= grid.length)
                entitiesToRemove.push(previousGridRows[i]);

            var isPreviousRowArray = Array.isArray(previousGridRows[i])
            var isArray = Array.isArray(grid[i])
            var isEmptyRow = isArray && grid[i].length === 0;
            var isNewRowType = isArray !== isPreviousRowArray || 
                typeof previousGridRows[i] === "undefined";

            // If we're removing or replacing the row then we get rid of the old entities
            if (isEmptyRow || isNewRowType)
                entitiesToRemove.push(previousGridRows[i]);

            if (!isEmptyRow) { 
                // We upsert the new version of the row
                if (isArray)
                    upsertCells(row, grid[i], previousGridRows[i], isNewRowType);
                else 
                    upsertText(row, grid[i], previousGridRows[i], isNewRowType);

                // We only increment the row counter for non-empty rows
                row++;
            }
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

        removeOldEntities(entitiesToRemove);
        ecs.addEntities("grid", my.cells);
        ecs.addEntities("grid", my.texts);

        eventManager.vent.trigger("SYSTEM:BOUNDS:UPDATE");
    };

    var synchroniseGridEvent = function() {
        ecs.runSystemOnce(
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