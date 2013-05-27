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
		this.state = "SELECT";
	}


	this.cells.push(cell);
	if (this.cells.length>this.max_length) {
		this.cells.shift();
	}

	console.log("cells:");
	for (var c = 0; c < this.cells.length; c++) {
		console.log("cell i:"+this.cells[c].x+" j:"+this.cells[c].y);
	}

}




