var cursorViewSystem = function(ecs, eventManager) {

    var getCells = function(entities) {
        return _.filter(
            entities, 
            function(entity) {
                return entity.hasRequiredComponents([componentTypeEnum.CELL]);
            });
    };

    // We traverse the grid entity to get all of the cell entities underneath
    // the is then used to update the bounds of the cursor cells
    var updateCursorBounds = function(cursorCell, cellEntities) {
        _.filter(cellEntities, function(cellEntity) {
            var cell = cellEntity.components[componentTypeEnum.CELL];
            if (cell.i === cursorCell.i && 
                cell.j === cursorCell.j)
                cursorCell[componentTypeEnum.BOUNDS] = cellEntity.components[componentTypeEnum.BOUNDS];
        });
    };

    var synchroniseCursor = function(gridEntity) {
        var cellEntities = getCells(gridEntity.subEntities);
        var cursor = gridEntity.components[componentTypeEnum.GRID].cursor;

        if (cursor.cells[0])
            updateCursorBounds(cursor.cells[0], cellEntities);
        if (cursor.cells[1])
            updateCursorBounds(cursor.cells[1], cellEntities);
    };

    var synchroniseCursorEvent = function() {
        ecs.runSystemOnce(
            [componentTypeEnum.GRID],
            function(gridEntity) {
                synchroniseCursor(gridEntity);
            });
        eventManager.vent.trigger("SYSTEM:RENDER:RENDER");
    };

    var initialiseEvents = function() {
        eventManager.vent.on("VIEWSYSTEM:CURSOR:UPDATED", synchroniseCursorEvent);
    };
    initialiseEvents();
};