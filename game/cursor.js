/**
 * @module NotebookNumbers
 **/
(function () {
    /**
     *
     * Defines custom behaviour used by the cursor and controls the execution of moves on the board. </br>
     * The contructor for a new cursor, this is called once by Grid on startup
     *
     * @class Cursor
     * @contructor
     **/
    var Cursor = function(checkCursorFunc) {
        this.cells = [];
        this.state = "SPEED";
        this.max_length = 2;
        this.checkCursorFunc = checkCursorFunc;
        eventManager.vent.on("CURSOR:CHECK", this.check, this);
        eventManager.vent.on("CURSOR:ADD", this.addToCursor, this);

        // Check the cursor when the spaceBar is pressed
        key('space', function() { eventManager.vent.trigger("CURSOR:CHECK"); });
    }

    Cursor.prototype.cleanUpEvents = function () {
        eventManager.vent.off("CURSOR:CHECK", this.check, this);
        eventManager.vent.off("CURSOR:ADD", this.addToCursor, this);
    }

    /**
     *  Checks if the cursor is full
     *
     *  @method hasEnoughCells
     *  @return {Boolean} true if it is full
     **/
    Cursor.prototype.hasEnoughCells = function() {
        return this.cells.length == this.max_length;
    }

    /**
     * Checks if a new cell is allowed in the cursor
     *
     * @method allowedInCursor
     * @return {Boolean} true is the cell is allow to be added
     **/
    Cursor.prototype.allowedInCursor = function(cell) {
        // Don't allow empty cells
        if (cell.digit == 0)
            return false;

        // Don't allow duplicates
        for (var i = 0; i < this.cells.length; i++) { 
            if (cell.equals(this.cells[i]))
                return false;
        } 

        return true;
    }

    /** 
     * Attempts to add a new cell to the cursor
     *
     * @method addToCursor
     **/
    Cursor.prototype.addToCursor = function(cell) {
        if (this.allowedInCursor(cell)) {

            // Cursor state machine
            if (this.state == "SPEED") {
                this.cells.push(cell);
                if (this.cells.length>this.max_length) {
                    this.cells.shift();
                }
            } else {
                this.cells[1] = cell;
            }

            // Update the view 				
            eventManager.vent.trigger("GRID:NUMBERS_UPDATED");
        }
    }

    /** 
     * Determines the reaction by the cursor to a new cell being clicked. It causes the cursor state machine to
     * change state from "SPEED" -> "SELECT" and vice-versa. Also, it is only when a cell is clicked that the cursor
     * checks itself to see if it contain a valid selection.
     *
     * @event onClick
     **/
    Cursor.prototype.check = function(cell) {
            
        // Log that shit!
        console.log("cells:");
        for (var c = 0; c < this.cells.length; c++) {
            console.log("cell i:"+this.cells[c].i+" j:"+this.cells[c].j);

        }

        // Check if the cursors is valid (Can be crossed out/removed/etc)
        var valid = false;
        if (this.hasEnoughCells()) { 
            valid = this.checkCursorFunc();
        }
        console.log("Valid move:"+valid);

        // Cursor state machine
        if (valid) {
            eventManager.vent.trigger("CURSOR:MAKE_MOVE", this.cells);
            this.cells = [];
            this.state = "SPEED";

        } else {
            if (cell) {
                if (this.state == "SPEED" && cell.digit != 0) {
                    this.cells = [cell];
                    this.state = "SELECT";
                } else { 
                    this.state = "SPEED";
                }
            } else {
                this.state = "SPEED";
            }
        }

        // Update the view 				
        eventManager.vent.trigger("GRID:NUMBERS_UPDATED");
    }
    window.Cursor = Cursor;
})();
