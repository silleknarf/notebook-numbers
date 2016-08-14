var cursorSystem = function(ecs, eventManager) {
	var my = this;
    my.cells = [];
    my.state = Cursor.states.speed;
    my.maxLength = 2;

    my.states = {
        speed: "SPEED", 
        select: "SELECT"
    }

    /**
     * Checks if a new cell is allowed in the cursor
     *
     * @method allowedInCursor
     * @return {Boolean} true is the cell is allow to be added
     **/
    var allowedInCursor = function(cell) {
        // Don't allow empty cells
        if (cell.digit == 0)
            return false;

        // Don't allow duplicates
        for (var i = 0; i < my.cells.length; i++) { 
            if (cell.equals(my.cells[i]))
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
    var hasEnoughCells = function() {
        return my.cells.length === my.maxLength;
    }

    /** 
     * Attempts to add a new cell to the cursor
     *
     * @method add
     **/
    var add = function(cell) {
        if (allowedInCursor(cell)) {

            // Cursor state machine
            if (my.state === my.states.speed) {
                my.cells.push(cell);
                if (my.cells.length>my.maxLength) {
                    my.cells.shift();
                }
            } else {
                my.cells[1] = cell;
            }

            // Update the view 				
            eventManager.vent.trigger("SYSTEM:GRID:CELLS_UPDATED");
        }
    };

    /** 
     * Determines the reaction by the cursor to a new cell being clicked. It causes the cursor state machine to
     * change state from "SPEED" -> "SELECT" and vice-versa. Also, it is only when a cell is clicked that the cursor
     * checks itself to see if it contain a valid selection.
     *
     * @event onClick
     **/
    var check = function(cell) {
        if (typeof(cell) !== "undefined")
            add(cell);
            
        // Log that shit!
        console.log("cells:");
        for (var c = 0; c < my.cells.length; c++) {
            console.log("cell i:"+my.cells[c].i+" j:"+my.cells[c].j);
        }

        // Check if the cursors is valid (Can be crossed out/removed/etc)
        var valid = false;
        if (hasEnoughCells()) { 
            valid = my.checkCursorFunc();
        }
        console.log("Valid move:"+valid);

        // Cursor state machine
        if (valid) {
            eventManager.vent.trigger("SYSTEM:LOGIC:MAKE_MOVE", my.cells);
            my.cells = [];
            my.state = my.states.speed;

        } else {
            if (cell) {
                if (my.state == my.states.speed && cell.digit != 0) {
                    my.cells = [cell];
                    my.state = my.states.select;
                } else { 
                    my.state = my.states.speed;
                }
            } else {
                my.state = my.states.speed;
            }
        }

        // Update the view 				
        eventManager.vent.trigger(Grid.events.render);
    }

	var initialiseEvents = function() {
        eventManager.vent.on("SYSTEM:CURSOR:CHECK", check);
        eventManager.vent.on("SYSTEM:CURSOR:ADD", add);
	};
	initialiseEvents();
};