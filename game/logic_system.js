var gridProxy = function() {
	var my = this;

	/** 
	 * Takes a pair of co-ords and returns true if they add to the given total
	 * or are equal.
	 *
	 * @param {Cell} firstCell the first of the cells to check for digit equality
	 * @param {Cell} secondCell the second of the cells to check for digit equality
	 * @return {Boolean} True if there is a valid total
	 **/
	var checkTotal = function(grid, firstCell, secondCell) {
		var targetTotal = config.numColumns+1;
		var first = grid[firstCell.i][firstCell.j];
		var second = grid[secondCell.i][secondCell.j];
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
	var checkVerticalMove = function(grid, p1, p2){
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
			console.log("Horizontal:" +grid[i][j]);
			if (grid[i][j] > 0) {
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
	var checkHorizontalMove = function(grid, p1, p2){
		var firstCell = p1;
		var secondCell = p2;
		if (p2.isBefore(p1)) {
			firstCell = p2;
			secondCell = p1;
		}

		var checkCell = _.clone(firstCell);
		if (checkCell.equals(secondCell)) {
			return false;
		}
		checkCell.j++;	
		while (checkCell.isBefore(secondCell)) {
			// numbers > 0 block the path
			if (grid[checkCell.i][checkCell.j] > 0) {
				return false;
			}	

			// Move left to right
			checkCell.j++;	

			// Move to the start of new line when we get to the end
			if (checkCell.j >= grid[0].length) {
				checkCell.i++;
				checkCell.j = 0;
			}

		}
		
		// Horizontal Match!
		return true;
	}

	/** 
	 * Checks whether the items in the cursor are a valid move
	 *
	 * @method check
	 * @return {Boolean} True if the move is valid
	 **/
	var check = function(grid, firstCell, secondCell) {
		var validTotal = checkTotal(grid, firstCell, secondCell);
		var validVertical = checkVerticalMove(grid, firstCell, secondCell)
		var validHorizontal = checkHorizontalMove(grid, firstCell, secondCell);
		var validMove = validVertical || validHorizontal;
		return validTotal && validMove;
	}

	/** 
	 * Refills the grid using the numbers which haven't been removed yet.
	 *
	 * @method refillGrid
	 **/
	var refillGrid = function(grid) {
	    var remainingNumbers = [];
		var allNumbers = 0;
		for (var i = 0; i < grid.length; i++) {
			for (var j = 0; j < grid[i].length; j++) {
				// if it is > 0 it should be re-added
				var item = grid[i][j];
				if (item > 0) {
					remainingNumbers.push(item);
				}
				allNumbers += 1;
			}
		}
			
		var lastI = 0;
		var lastJ = 0;
		for (var i = grid.length-1; i >= 0; i--) {
			for (var j = grid[i].length; j >= 0; j--) {
				var number = grid[i][j]; 
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
			if (lastJ == config.numColumns) {
				// Add a new row
				lastI += 1;
				lastJ = 0;
				grid[lastI] = [number];
			} else {
				// Add to the current row
				grid[lastI][lastJ] = number;
			}
			lastJ += 1;
		}
	}

	/** 
	 * Checks if the game has been completed TODO: Call this somewhere game complete!
	 *
	 * @method finalise
	 * @return {Boolean} True if the game has been completed
	 **/
	var checkCompleted = function(grid) {
		for (var i = 0; i < grid.length; i++) {
			for (var j = 0; j < grid[i].length; j++) { 
				// We still have numbers left to clear
				var item = grid[i][j];
				if (item > 0) {
					return false;
				}
			}
		}
		return true;
	}

	/**
	 * Updates the cells in the cursor if a move has been made, by setting their values in the grid to 0.
	 *
	 * @method makeMove
	 **/
	var makeMove = function(grid, firstCell, secondCell) {
		var cells = [firstCell, secondCell]
		for (var c = 0; c < cells.length; c++) {
			var i = cells[c].i;
			var j = cells[c].j;
			grid[i][j] = 0;
		}
	}
	my.makeMove = makeMove;
	my.checkCompleted = checkCompleted;
	my.refillGrid = refillGrid;
	return my;
};

var logicSystem = function(ecs, eventManager) {


	var refillGridEvent = function() {
		ecs.runSystem(
			[componentTypeEnum.GRID],
			function(entity) {
				var grid = entity.components[componentTypeEnum.GRID].grid;
				refillGrid(grid);
				eventManager.vent.trigger("SYSTEM:LOGIC:GRID_CHANGED");
			});
	}

	var makeMoveEvent = function(firstCell, secondCell) {
		ecs.runSystem(
			[componentEnumType.GRID],
			function(entity) {
				var grid = entity.components[componentTypeEnum.GRID].grid;
				var isMovePossible = check(grid, firstCell, secondCell);
				if (isMovePossible) {
					makeMove(grid, firstCell, secondCell);
					eventManager.vent.trigger("SYSTEM:LOGIC:GRID_CHANGED");
				}
			});
	};

	var initialiseEvents = function() {
		eventManager.vent.on("SYSTEM:LOGIC:REFILL_GRID", refillGridEvent);
		eventManager.vent.on("SYSTEM:LOGIC:MAKE_MOVE", makeMoveEvent);
	};

	initialiseEvents();
};