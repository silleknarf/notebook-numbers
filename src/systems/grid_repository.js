var gridRepositoryFactory = function(cellRepository) {
	var my = {};

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

		for (var i = lowerCell.i+1; i < upperCell.i; i++) {
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
		if (cellRepository.isBefore(p2, p1)) {
			firstCell = p2;
			secondCell = p1;
		}

		var checkCell = _.clone(firstCell);
		if (cellRepository.equals(checkCell, secondCell)) {
			return false;
		}
		checkCell.j++;	
		while (cellRepository.isBefore(checkCell, secondCell)) {
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

			// Don't evaluate the text lines
			if (!Array.isArray(grid[i]))
				continue;

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

			// Don't evaluate the text lines
			if (!Array.isArray(grid[i]))
				continue;

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

			// Don't evaluate the text lines
			if (!Array.isArray(grid[i]))
				continue;

			for (var j = 0; j < grid[i].length; j++) { 
				// We still have numbers left to clear
				var item = grid[i][j];
				if (item > 0) {
					return false;
				}
			}
		}

		eventManager.vent.trigger("SYSTEM:SCORE:COMPLETED_GAME");
		return true;
	}

	/**
	 * Updates the cells in the cursor if a move has been made, by setting their values in the grid to 0.
	 *
	 * @method makeMove
	 **/
	var makeMove = function(grid, firstCell, secondCell) {
		var cells = [firstCell, secondCell]
		var rows = {};
		for (var c = 0; c < cells.length; c++) {
			var i = cells[c].i;
			var j = cells[c].j;
			grid[i][j] = 0;
			// we need to keep a set of rows to maybe remove
			rows[i] = true;
		}

		maybeRemoveRows(grid, rows);
	}

	// Try and remove each row that had a cell crossed out
	var maybeRemoveRows = function(grid, rows) {
		_.forEach(
			_.keys(rows),
			function(i) {
				maybeClearEmptyRow(grid, i);
			});
	}

	// If the row only contains 0s then it can be cleared completely to free up grid space
	var maybeClearEmptyRow = function(grid, rowIndex) {
		var row = grid[rowIndex];
		if (Array.isArray(row)) {
			var isEmptyRow = _.every(
				row, 
				function(element) {
					return element === 0;
				});

			if (isEmptyRow) {
				grid[rowIndex] = [];
				eventManager.vent.trigger("SYSTEM:SCORE:ADD", 10);
				return true;
			}
		}
		return false;
	}

	var containsText = function(grid) {
		return _(grid)
			.map(function(row) {
				return !Array.isArray(row);
			})
			.some();
	}

	var saveGrid = function(grid) {
		if (!grid) {
			localStorage.removeItem('grid');
			return;
		}
		
		if (!containsText(grid))
			localStorage.setItem('grid', JSON.stringify(grid));
	}

	my.savedGridLoaded = false;
	var loadGrid = function() {
		if (my.savedGridLoaded)
			return null;

		var grid = localStorage.getItem('grid');
		if (grid)
			grid = JSON.parse(grid);

		my.savedGridLoaded = true;
		return grid;
	}

	my.makeMove = makeMove;
	my.checkCompleted = checkCompleted;
	my.refillGrid = refillGrid;
	my.check = check;
	my.saveGrid = saveGrid;
	my.loadGrid = loadGrid;
	return my;
};
