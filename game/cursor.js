/**
 * @module NotebookNumbers
 **/

/**
 *
 * Defines custom behaviour used by the cursor and controls the execution of moves on the board. </br>
 * The contructor for a new cursor, this is called once by Grid on startup
 *
 * @class Cursor
 * @contructor
 **/
function Cursor() {
	this.cells = []
	this.state = "SPEED";
	this.max_length = 2;
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
	for (var i = 0; i < this.cells.length; i++) { 
			// Don't allow duplicates
		if (	cell.equals(this.cells[i]) ||
			// Don't allow empty cells
			cell.digit == 0) {
			return false;
		}
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
	}

}

/**
 * When the mouse is moved over a cell then it is attemptted to be added to the cursor
 *
 * @event onMouseOver
 **/
Cursor.prototype.onMouseOver = function(cell) {
	this.addToCursor(cell);
}


/** 
 * Determines the reaction by the cursor to a new cell being clicked. It causes the cursor state machine to
 * change state from "SPEED" -> "SELECT" and vice-versa. Also, it is only when a cell is clicked that the cursor
 * checks itself to see if it contain a valid selection.
 *
 * @event onClick
 **/
Cursor.prototype.onClick = function(cell) {
		
	// Log that shit!
	console.log("cells:");
	for (var c = 0; c < this.cells.length; c++) {
		console.log("cell i:"+this.cells[c].i+" j:"+this.cells[c].j);

	}

	// Check if the cursors is valid (Can be crossed out/removed/etc)
	var valid = false;
	if (this.hasEnoughCells()) { 
		valid = app.grid.check();
	}
	console.log("Valid move:"+valid);


	// Cursor state machine
	if (valid) {
		app.grid.makeMove();
		this.cells = [];
		this.state = "SPEED";
	} else {
		if (this.state == "SPEED") { 
			this.cells = [cell];
			this.state = "SELECT";
		} else { 
			this.state = "SPEED";
		}
	}
}
