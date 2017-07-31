var cursorSystem = function(ecs, eventManager, gridUtil, cellUtil) {
    var my = {};
    my.maxLength = 2;

    my.states = {
        speed: "SPEED", 
        select: "SELECT"
    };

    /**
     * Checks if a new cell is allowed in the cursor
     *
     * @method allowedInCursor
     * @return {Boolean} true is the cell is allow to be added
     **/
    var allowedInCursor = function(grid, cursor, cell) {
        // Don't allow empty cells
        if (grid[cell.i][cell.j] === 0)
            return false;

        // Don't allow duplicates
        for (var i = 0; i < cursor.cells.length; i++) { 
            if (cellUtil.equals(cell, cursor.cells[i]))
                return false;
        } 

        return true;
    }

    /**
     *  Checks if the cursor is full
     *
     *  @method hasEnoughCells
     *  @return {Boolean} true if it is full
     **/
    var hasEnoughCells = function(cursor) {
        return cursor.cells.length === my.maxLength;
    }

    /** 
     * Attempts to add a new cell to the cursor
     *
     * @method add
     **/
    var add = function(grid, cursor, cell) {
        if (allowedInCursor(grid, cursor, cell)) {

            // Cursor state machine
            if (!cursor.state) cursor.state = my.states.speed;
            if (cursor.state === my.states.speed) {
                cursor.cells.push(cell);
                if (cursor.cells.length>my.maxLength) {
                    cursor.cells.shift();
                }
            } else {
                cursor.cells[1] = cell;
            }

            eventManager.vent.trigger("VIEWSYSTEM:CURSOR:UPDATED");
        }
    };

    /** 
     * Determines the reaction by the cursor to a new cell being clicked. It causes the cursor state machine to
     * change state from "SPEED" -> "SELECT" and vice-versa. Also, it is only when a cell is clicked that the cursor
     * checks itself to see if it contain a valid selection.
     *
     * @event onClick
     **/
    var check = function(grid, cursor, cell) {
        if (typeof(cell) !== "undefined")
            add(grid, cursor, cell);
            
        // Log that shit!
        console.log("cells:");
        for (var c = 0; c < cursor.cells.length; c++) {
            console.log("cell i:"+cursor.cells[c].i+" j:"+cursor.cells[c].j);
        }

        // Check if the cursors is valid (Can be crossed out/removed/etc)
        var valid = false;
        if (hasEnoughCells(cursor)) { 
            valid = gridUtil.check(
                grid, 
                cursor.cells[0], 
                cursor.cells[1]);
        }
        console.log("Valid move:"+valid);

        // Cursor state machine
        if (!cursor.state) cursor.state = my.states.speed;

        if (valid) {
            eventManager.vent.trigger(
                "SYSTEM:LOGIC:MAKE_MOVE", 
                cursor.cells[0], 
                cursor.cells[1]);

            cursor.cells = [];
            cursor.state = my.states.speed;

        } else {
            if (cell) {
                if (cursor.state === my.states.speed && cell.digit != 0) {
                    cursor.cells = [cell];
                    cursor.state = my.states.select;
                } else { 
                    cursor.state = my.states.speed;
                }
            } else {
                cursor.state = my.states.speed;
            }
        }

        eventManager.vent.trigger("VIEWSYSTEM:CURSOR:UPDATED");
    }

    var addEvent = function(cell) { 
        var gridsUpdated = {};
        ecs.runSystemOnce(
            [componentTypeEnum.GRID],
            function(entity) {
                var gridComponent = entity.components[componentTypeEnum.GRID]; 
                var grid = gridComponent.grid;
                var cursor = gridComponent.cursor;

                // We update each grid only once
                if (gridsUpdated[grid.id] === true)
                    return;
                gridsUpdated[grid.id] = true;

                add(grid, cursor, cell);
            });
    };

    var checkEvent = function(cell) {
        var gridsUpdated = {};
        ecs.runSystemOnce(
            [componentTypeEnum.GRID],
            function(entity) {
                var gridComponent = entity.components[componentTypeEnum.GRID]; 
                var grid = gridComponent.grid;
                var cursor = gridComponent.cursor;

                // We update each grid only once
                if (gridsUpdated[grid.id] === true)
                    return;
                gridsUpdated[grid.id] = true;
                
                check(grid, cursor, cell)
            });
    };

    var initialiseEvents = function() {
        eventManager.vent.on("SYSTEM:CURSOR:CHECK", checkEvent);
        eventManager.vent.on("SYSTEM:CURSOR:ADD", addEvent);
    };
    initialiseEvents();
};