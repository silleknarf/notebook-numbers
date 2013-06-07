/**
 * @module NotebookNumbers
 **/
(function() {

	/** 
	 * Draws the button that refills the grid, i.e. click when you have no more moves you want to make
	 *
	 * @method drawRefillGridButton
	 **/
	var RefillGridView = function(width, height) {
		this.initialize(width, height);
	}
	var p = RefillGridView.prototype = new createjs.Container();
	p.Container_initialize = p.initialize;

	p.initialize = function(width, height) {
		this.Container_initialize();

		// Setting up the text properties
		var refillGrid = new createjs.Text("Refill Grid", "32px Helvetica", "#000000");

		// Setting up the button positioning
		var middleX = width / 2;
		var refillGridPadding = 100;
		refillGrid.x = middleX - refillGridPadding;

		var topPadding = 15;
		refillGrid.y = topPadding+height;
	 
		// Adding collision detection
		var hit = new createjs.Shape();
		hit.graphics.beginFill("#F00").drawRect(0, 0, refillGrid.getMeasuredWidth(), refillGrid.getMeasuredHeight());
		refillGrid.hitArea = hit;

		// Set the height of the button as a property
		this.height = refillGrid.getMeasuredHeight()

		/**
		 *  Refill Grid Click Event - updates the cells and move the button down
		 *  @event onClick
		 **/
		refillGrid.onClick = function(evt) {
			// Refill grid event 
			NotebookNumbers.vent.trigger("REFILL_GRID");
		}
		this.addChild(refillGrid);
		NotebookNumbers.vent.on("GRID:HEIGHT_UPDATED", this.updateButtonPosition, refillGrid);
	}

	RefillGridView.prototype.updateButtonPosition = function() {
		// Move the button down
		this.y = app.getHeight();
	}
	
	window.RefillGridView = RefillGridView;
})();
