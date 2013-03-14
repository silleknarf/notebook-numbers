//
// NotebookNumbers.js -- version 1
//

if(!Array.prototype.last) {
    Array.prototype.last = function() {
        return this[this.length - 1];
    }
}

function Point(x,y) {
	this.x = x;
	this.y = y;
}

// Add two points together
Point.prototype.add = function(otherPoint) {
	this.x += otherPoint.x;
	this.y += otherPoint.y;
}

// Add two points together
Point.prototype.equals = function(otherPoint) {
	this.x == otherPoint.x;
	this.y == otherPoint.y;
}

Point.prototype.isBefore(otherPoint) {
	// Case they're on the same line or p1 is below
	if (this.y <= otherPoint.y) {
		// this is on the left
		if (this.x < otherPoint.x) {
			return true;
		} 	
	}
	return false;
}

function Grid(){
	this.width = 9;
}

// Creates an arraylist representing the grid with the normal start values
Grid.prototype.init = function() {
	grid = [[],[],[]] 
	firstRow = grid[0]
	secondRow = grid[1]
	thirdRow = grid[2]
	for (int i = 1; i<=this.width; i++) {
		firstRow[i-1] = i;
		if (i%2==1) {
			secondRow[i-1] = 1;
		} else {
			secondRow[i-1] = i/2;
		}
		if (this.width%2==1) {
			if (i%2==1) {
				thirdRow[i-1] = (i/2)+((this.width/2)+1);
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
	this.grid = grid
}

Grid.prototype.check = function(firstPoint, secondPoint) {
	if (!checkTotal) {
		return false;
	}
	if (!checkVerticalMove(firstPoint, secondPoint) {
		return false;
	}

	if (!checkHorizontalMove(firstPoint, secondPoint) {
		return false;
	}
	return true;
}

// Takes a pair of co-ords and returns true if they add to the given total
// or are equal
Grid.prototype.checkTotal = function(firstPoint, secondPoint) {
	var targetTotal = 10;
	first = this.grid[firstPoint.y][firstPoint.x];
	second = this.grid[secondPoint.y][secondPoint.x];
	if ((first != second) || (first+second != targetTotal)) {
		return false;
	}
	return true;
}

Grid.prototype.checkVerticalMove = function(p1,p2){
	var lowerPoint = p1;
	var upperPoint = p2;
	if (p1.y < p2.y) {
		lowerPoint = p1;
		upperPoint = p2;
	} 	

	// x axis not aligned
	if (lowerPoint.x != upperPoint.x ) {
		// No vertical moves possible
		return false;
	}

	for (var y = lowerPoint.y; y <= upperPoint.y; y++) {
		x = lowerPoint.x;

		// numbers > 0 block the path
		if (this.grid[y][x] > 0) {
			return false;
		}
	}

	// Test
	if (upperPoint.y == y) {
		//return true;
	}

	// We found it!
	return true;
}

Grid.prototype.checkHorizontalMove = function(p1,p2){
	var firstPoint = p1;
	var secondPoint = p2;
	if (p2.isBefore(p1)) {
		firstPoint = p2;
		secondPoint = p1;
	}

	var checkPoint = firstPoint;
	while (checkPoint.isBefore(secondPoint)) {
		// Move to the start of new line when we get to the end
		if (checkPoint.x == this.grid[0].length) {
			checkPoint.x = 0;
			checkPoint.y++;
		}
		// numbers > 0 block the path
		if (this.grid[checkPoint.y][checkPoint.x] > 0) {
			return false;
		}	

		// Move left to right
		checkPoint.x++;	
	}
	
	// We found it!
	return true;
}
Grid.prototype.refillGrid = function() {
	var remainingNumbers = []
	for (var row in this.grid) {
		for (var item in row) { 
			// if it is > 0 it should be re-added
			if (item > 0) {
				remainingNumbers.push(item);
			}
		}
	}
	for (var number in remainingNumbers) {
		var currentLine = this.grid.last();
		// Add a new row
		if (currentLine.length == this.grid[0].length) {
			this.grid.push([number])
		// Add to the current row
		} else {
			this.grid.last().push(number)
		}
	}
}

Grid.prototype.finalise = function() {
	for (var row in this.grid) {
		for (var item in row) { 
			// We still have numbers left to clear
			if (item > 0) {
				return false;
			}
		}
	}
	return true;
}


	
	/**
	 * @param args
	 */
	/*
	public static void main(String[] args) {
		Logic logic = new Logic();
		
		ArrayList<int[]> grid = logic.gridNumbers(9);
		grid.get(0)[0]=-1;
		grid.get(1)[0]=-1;
		grid.get(1)[1]=8;
		grid.get(0)[7]=-1;
		grid.get(1)[2]=7;
		grid = logic.refillGrid(grid);
		grid = logic.makeMove(grid, new int[]{1,0}, new int[]{1,1});
		grid = logic.makeMove(grid, new int[]{5,5}, new int[]{5,4});
		grid = logic.refillGrid(grid);

		
		for (int[] i : grid) {
			for (int j : i) {
				System.out.print(j+", ");
			}
			System.out.println();
		}
		
		
		ArrayList<int[]> valids = logic.validMoves(grid, new int[]{8,2});
		for (int[] valid : valids) {
			System.out.print(valid[0]+", ");
			System.out.println(valid[1]);

		}
	}
	*/

}
