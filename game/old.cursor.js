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
        this.state = Cursor.states.speed;
        this.max_length = 2;
        this.checkCursorFunc = checkCursorFunc;
        eventManager.vent.on(Cursor.events.check, this.check, this);
        eventManager.vent.on(Cursor.events.add, this.addToCursor, this);

        // Check the cursor when the spaceBar is pressed
        key('space', function() { eventManager.vent.trigger(Cursor.events.check); });
    }

    Cursor.events = {
        check: "CURSOR:CHECK",
        add: "CURSOR:ADD",
        makeMove: "CURSOR:MAKE_MOVE"
    };

    Cursor.states = {
        speed: "SPEED", 
        select: "SELECT"
    }

    Cursor.prototype.cleanUpEvents = function () {
        eventManager.vent.off(Cursor.events.check, this.check, this);
        eventManager.vent.off(Cursor.events.add, this.addToCursor, this);
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
            if (this.state == Cursor.states.speed) {
                this.cells.push(cell);
                if (this.cells.length>this.max_length) {
                    this.cells.shift();
                }
            } else {
                this.cells[1] = cell;
            }

            // Update the view 				
            eventManager.vent.trigger(Grid.events.render);
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
        if (typeof(cell) !== "undefined")
            this.addToCursor(cell);
            
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
            eventManager.vent.trigger(Cursor.events.makeMove, this.cells);
            this.cells = [];
            this.state = Cursor.states.speed;

        } else {
            if (cell) {
                if (this.state == Cursor.states.speed && cell.digit != 0) {
                    this.cells = [cell];
                    this.state = Cursor.states.select;
                } else { 
                    this.state = Cursor.states.speed;
                }
            } else {
                this.state = Cursor.states.speed;
            }
        }

        // Update the view 				
        eventManager.vent.trigger(Grid.events.render);
    }
    window.Cursor = Cursor;
})();
