var cellRepositoryFactory = function() {
	var my = {};

    var equals = function(firstCell, secondCell) {
        return (firstCell.i == secondCell.i) && (firstCell.j == secondCell.j);
    }

	/** 
	 *  Check if the cell being checked is before the other cell
	 *
	 *  @method isBefore
	 *  @param {Cell} otherCell the cell you wish to compare with
	 *  @return {Boolean}
	 **/
	var isBefore = function(otherCell) {
		// Case they're on the same line or otherCell is below
		if (this.i <= otherCell.i) {
			// It's definitely below
			if (this.i < otherCell.i) {
				return true;
			}

			// this is on the left on the same line
			if (this.j < otherCell.j) {
				return true;
			} 	
		}
		return false;
	}

    my.equals = equals;
    my.isBefore = isBefore;

    return my;
};
