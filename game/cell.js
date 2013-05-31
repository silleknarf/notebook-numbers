function Cell(target) {
	this.target = target;
	this.digit = target.digit;
	this.x = target.j;
	this.y = target.i;
}

// Add two points together
Cell.prototype.add = function(otherCell) {
	this.x += otherCell.x;
	this.y += otherCell.y;
}

// Add two points together
Cell.prototype.equals = function(otherCell) {
	this.x == otherCell.x;
	this.y == otherCell.y;
}

Cell.prototype.isBefore = function(otherCell) {
	// Case they're on the same line or otherCell is below
	if (this.y <= otherCell.y) {
		// It's definitely below
		if (this.y < otherCell.y) {
			return true;
		}

		// this is on the left on the same line
		if (this.x < otherCell.x) {
			return true;
		} 	
	}
	return false;
}
