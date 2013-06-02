function Grid(){
	this.width = 9;
	this.cursor = new Cursor();
	this.init();
}

// Creates an arraylist representing the grid with the normal start values
Grid.prototype.init = function() {
	data = [[],[],[]] 
	firstRow = data[0]
	secondRow = data[1]
	thirdRow = data[2]
	for (var i = 1; i<=this.width; i++) {
		firstRow[i-1] = i;
		if (i%2==1) {
			secondRow[i-1] = 1;
		} else {
			secondRow[i-1] = i/2;
		}
		if (this.width%2==1) {
			if (i%2==1) {
				thirdRow[i-1] = (i/2)+((this.width/2)+1)-1;
			} else {
				thirdRow[i-1] = 1;
			}	
		} else {
			if (i%2==1) {
				thirdRow[i-1] = 1;
			} else {
				thirdRow[i-1] = (i/2)+((this.width/2)+1)-1;
			}	
		}
	}
	this.data = data
}

Grid.prototype.check = function() {
	if (!this.cursor.hasEnoughCells()) {
		return false;
	}	
	firstCell = this.cursor.cells[0];
	secondCell = this.cursor.cells[1];
	validTotal = this.checkTotal(firstCell, secondCell);
	validMove = this.checkVerticalMove(firstCell, secondCell) || this.checkHorizontalMove(firstCell, secondCell);
	return validTotal && validMove;
}

// Takes a pair of co-ords and returns true if they add to the given total
// or are equal
Grid.prototype.checkTotal = function(firstCell, secondCell) {
	var targetTotal = this.width+1;
	first = this.data[firstCell.i][firstCell.j];
	second = this.data[secondCell.i][secondCell.j];
	if ((first==second) || (first+second==targetTotal)) {
		return true;
	}
	return false;
}

Grid.prototype.checkVerticalMove = function(p1,p2){
	var lowerCell = p1;
	var upperCell = p2;
	if (p2.i < p1.i) {
		lowerCell = p2;
		upperCell = p1;
	} 	

	// x axis not aligned
	if (lowerCell.j != upperCell.j ) {
		// No vertical moves possible
		return false;
	}

	for (var i = lowerCell.i+1; i < upperCell.i-1; i++) {
		var j = lowerCell.j;

		// numbers > 0 block the path
		console.log("Horizontal:" +this.data[i][j]);
		if (this.data[i][j] > 0) {
			return false;
		}
	}

	// Vertical Match!
	return true;
}

Grid.prototype.checkHorizontalMove = function(p1,p2){
	var firstCell = p1;
	var secondCell = p2;
	if (p2.isBefore(p1)) {
		firstCell = p2;
		secondCell = p1;
	}

	var checkCell = {};
	$.extend(checkCell, firstCell);
	if (checkCell.equals(secondCell)) {
		return false;
	}
	checkCell.j++;	
	while (checkCell.isBefore(secondCell)) {
		// numbers > 0 block the path
		if (this.data[checkCell.i][checkCell.j] > 0) {
			return false;
		}	

		// Move left to right
		checkCell.j++;	

		// Move to the start of new line when we get to the end
		if (checkCell.j >= this.data[0].length) {
			checkCell.i++;
			checkCell.j = 0;
		}

	}
	
	// Horizontal Match!
	return true;
}
Grid.prototype.refillGrid = function() {
	var remainingNumbers = []
	for (var i = 0; i < this.data.length; i++) {
		for (var j = 0; j < this.data[0].length; j++) {
			// if it is > 0 it should be re-added
			var item = this.data[i][j];
			if (item > 0) {
				remainingNumbers.push(item);
			}
		}
	}
	for (var i = 0; i < remainingNumbers.length; i++) {
		var number = remainingNumbers[i];
		var currentLine = this.data[this.data.length-1];
		// Add a new row
		if (currentLine.length == this.data[0].length) {
			this.data.push([number])
		// Add to the current row
		} else {
			this.data[this.data.length-1].push(number)
		}
	}
}

Grid.prototype.finalise = function() {
	for (var row in this.data) {
		for (var item in row) { 
			// We still have numbers left to clear
			if (item > 0) {
				return false;
			}
		}
	}
	return true;
}

Grid.prototype.makeMove = function() {
	for (var c = 0; c < this.cursor.cells.length; c++) {
		var i = this.cursor.cells[c].i;
		var j = this.cursor.cells[c].j;
		this.data[i][j] = 0;
	}
}

