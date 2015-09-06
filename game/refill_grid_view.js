/**
 * @module NotebookNumbers
 **/
(function() {

	/** 
	 * Draws the button that refills the grid, i.e. click when you have no more moves you want to make
	 *
	 * @method drawRefillGridButton
	 **/
	var RefillGridButton = function(heightProvider, dimensions) {
		this.initialize(heightProvider, dimensions);
	}

	var p = RefillGridButton.prototype = new createjs.Container();
	p.Container_initialize = p.initialize;

	p.initialize = function(heightProvider, dimensions) {
	    console.log("refill_grid_button:initialized");
		this.Container_initialize();
		this.dimensions = dimensions;

		// Setting up the text properties
		var refillGrid = new createjs.Text("Refill Grid", "40px "+config.font, config.navy);

		// Setting up the button positioning
		var middleX = this.dimensions.pageWidth / 2;
		refillGrid.x = middleX;
		refillGrid.textAlign = "center";

		// Adding collision detection
		var hit = new createjs.Shape();
	    hit.graphics
            .beginFill("#F00")
			.drawRect(	-refillGrid.getMeasuredWidth()/2, 0, 
					 	refillGrid.getMeasuredWidth(), refillGrid.getMeasuredHeight());
		refillGrid.hitArea = hit;

		// Set the height of the button as a property
	    this.height = refillGrid.getMeasuredHeight();
	    this.heightProvider = heightProvider;

		/**
		 *  Refill Grid Click Event - updates the cells and move the button down
		 *  @event onClick
		 **/
		refillGrid.onClick = function(evt) {
			// Refill grid event 
			eventManager.vent.trigger("REFILL_GRID");
		}
		this.addChild(refillGrid);
		eventManager.vent.on("GRID:HEIGHT_UPDATED", this.updateButtonPosition, this);
	}

	RefillGridButton.prototype.updateButtonPosition = function() {
		// Move the button down
		this.y = this.heightProvider();
	}
	
	window.RefillGridButton = RefillGridButton;
})();
