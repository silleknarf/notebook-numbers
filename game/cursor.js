function Cursor() {
	this.cells = []
	this.state = "SPEED";
	this.max_length = 2;
}
Cursor.prototype.hasEnoughCells = function() {
	return this.cells.length == this.max_length;
}


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

Cursor.prototype.addToCursor = function(cell) {
	if (this.allowedInCursor(cell)) {
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

Cursor.prototype.onMouseOver = function(cell) {
	this.addToCursor(cell);
}


Cursor.prototype.onClick = function(cell) {

	// Cursor state machine
		
	// Log that shit!
	console.log("cells:");
	for (var c = 0; c < this.cells.length; c++) {
		console.log("cell i:"+this.cells[c].i+" j:"+this.cells[c].j);

	}

	var valid = false;
	if (this.hasEnoughCells()) { 
		valid = app.grid.check();
	}
	console.log("Valid move:"+valid);
	if (valid) {
		app.grid.makeMove();
		this.cells = [];
		this.state = "SPEED";
	} else {
		if (this.state = "SPEED") { 
			this.cells[0] = cell;
			this.state = "SELECT";
		} else { 
			this.state = "SPEED";
		}
	}
}
