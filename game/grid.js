(function () {
	/**
	 * Initialises the logical grid backend and provides the functionality for checking using it's cursor object.
	 *
	 * @class Grid
	 * @constructor
	 **/
	var Grid = function(width, dimensions) {
	    this.dimensions = dimensions;
		this.initialize(width);
	}

    Grid.events = {
        render: "GRID:RENDER",
        refill: "GRID:REFILL",
        completed: "GRID:COMPLETED"
    };

	var p = Grid.prototype = new createjs.Container();
	p.Container_initialize = p.initialize;

	/**
	 * Creates an arraylist representing the grid with the normal start values and stores it as data
	 *
	 * @method init
	 **/
	p.initialize = function(width) {
		console.log("Grid initialized");
		eventManager.vent.on(Grid.events.refill, this.refillGrid, this);
		eventManager.vent.on(Cursor.events.makeMove, this.makeMove, this);
		this.width = width;
	    var gridContext = this; 
		this.cursor = new Cursor(function() { return gridContext.check.call(gridContext); });
	    var data = [[], [], []];
	    var firstRow = data[0];
		var secondRow = data[1];
	    var thirdRow = data[2];
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
		this.data = data;
	}

    Grid.prototype.cleanUpEvents = function()
    {
		eventManager.vent.off(Grid.events.refill, this.refillGrid, this);
		eventManager.vent.off(Cursor.events.makeMove, this.makeMove, this);
        this.cursor.cleanUpEvents();
    };


	/** 
	 * Checks whether the items in the cursor are a valid move
	 *
	 * @method check
	 * @return {Boolean} True if the move is valid
	 **/
	Grid.prototype.check = function() {
		if (!this.cursor.hasEnoughCells()) {
			return false;
		}	
		var firstCell = this.cursor.cells[0];
		var secondCell = this.cursor.cells[1];
		var validTotal = this.checkTotal(firstCell, secondCell);
		var validMove = this.checkVerticalMove(firstCell, secondCell) || this.checkHorizontalMove(firstCell, secondCell);
		return validTotal && validMove;
	}

	/** 
	 * Takes a pair of co-ords and returns true if they add to the given total
	 * or are equal.
	 *
	 * @param {Cell} firstCell the first of the cells to check for digit equality
	 * @param {Cell} secondCell the second of the cells to check for digit equality
	 * @return {Boolean} True if there is a valid total
	 **/
	Grid.prototype.checkTotal = function(firstCell, secondCell) {
		var targetTotal = this.width+1;
		var first = this.data[firstCell.i][firstCell.j];
		var second = this.data[secondCell.i][secondCell.j];
		if ((first==second) || (first+second==targetTotal)) {
			return true;
		}
		return false;
	}

	/** 
	 * Takes a pair of co-ords and returns true if the have a clear path between them vertically.
	 * 
	 * @param {Cell} firstCell the first of the cells to check 
	 * @param {Cell} secondCell the second of the cells to check 
	 * @return {Boolean} True if there is a valid vertical move
	 **/
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

	/** 
	 * Takes a pair of co-ords and returns true if the have a clear path between them horizontal and
	 * down to the start of the next line (Like English text)
	 * 
	 * @param {Cell} firstCell the first of the cells to check 
	 * @param {Cell} secondCell the second of the cells to check 
	 * @return {Boolean} True if there is a valid horizontal move
	 **/
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

	/** 
	 * Refills the grid using the numbers which haven't been removed yet.
	 *
	 * @method refillGrid
	 **/
	Grid.prototype.refillGrid = function() {
	    var remainingNumbers = [];
		var allNumbers = 0;
		for (var i = 0; i < this.data.length; i++) {
			for (var j = 0; j < this.data[i].length; j++) {
				// if it is > 0 it should be re-added
				var item = this.data[i][j];
				if (item > 0) {
					remainingNumbers.push(item);
				}
				allNumbers += 1;
			}
		}
			
		var lastI = 0;
		var lastJ = 0;
		for (var i = this.data.length-1; i >= 0; i--) {
			for (var j = this.data[i].length; j >= 0; j--) {
				var number = this.data[i][j]; 
				if (number > 0) {
					lastJ = j+1;
					lastI = i;

					// Break the loop early
					i = -1;
					j = -1;
				}
			}
		}
		for (i = 0; i < remainingNumbers.length; i++) {
			// For each number
			number = remainingNumbers[i];
			if (lastJ == this.width) {
				// Add a new row
				lastI += 1;
				lastJ = 0;
				this.data[lastI] = [number];
			} else {
				// Add to the current row
				this.data[lastI][lastJ] = number;
			}
			lastJ += 1;
		}

	    this.dimensions.gridHeight = this.data.length;
		eventManager.vent.trigger(Grid.events.render);
		eventManager.vent.trigger(BackgroundView.events.render);
	}

	/** 
	 * Checks if the game has been completed TODO: Call this somewhere game complete!
	 *
	 * @method finalise
	 * @return {Boolean} True if the game has been completed
	 **/
	Grid.prototype.checkGridCompleted = function() {
		for (var i = 0; i < this.data.length; i++) {
			for (var j = 0; j < this.data[i].length; j++) { 
				// We still have numbers left to clear
				var item = this.data[i][j];
				if (item > 0) {
					return false;
				}
			}
		}
		eventManager.vent.trigger(Grid.events.completed);
		return true;
	}

	/**
	 * Updates the cells in the cursor if a move has been made, by setting their values in the grid to 0.
	 *
	 * @method makeMove
	 **/
	Grid.prototype.makeMove = function(cells) {
		for (var c = 0; c < cells.length; c++) {
			var i = cells[c].i;
			var j = cells[c].j;
			this.data[i][j] = 0;
		}
		this.checkGridCompleted();
	}
	window.Grid = Grid;
})();
