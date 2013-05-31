function Cursor() {
	this.cells = []
	this.state = "SPEED";
	this.max_length = 2;
}
Cursor.prototype.hasEnoughCells = function() {
	return this.cells.length == this.max_length;
}

Cursor.prototype.moveOver = function(cell) {
	if (this.state == "SPEED") {
		this.cells.push(cell);	
		if (this.cells.length==this.max_length) {
			this.cells.unshift();
		}
	} 
}

Cursor.prototype.click = function(cell) {
	if (this.state == "SPEED") {
		//this.state = "SELECT";
	}
		
	// Don't allow duplicates
	for (var i = 0; i < this.cells.length; i++) { 
		if (cell.equals(this.cells[i])) {
			return;
		}
	} 

	this.cells.push(cell);
	if (this.cells.length>this.max_length) {
		this.cells.shift();
	}

	console.log("cells:");
	for (var c = 0; c < this.cells.length; c++) {
		console.log("cell x:"+this.cells[c].x+" y:"+this.cells[c].y);

	}
	if (this.hasEnoughCells()) { 
		var valid = app.grid.check();
		console.log("Valid move:"+valid);
		if (valid) {
			app.grid.makeMove();
		}
	}
}




