/**
 * @module NotebookNumbers
 **/
(function() {

	/** 
	 * Draws the button that refills the grid, i.e. click when you have no more moves you want to make
	 *
	 * @method drawRefillGridButton
	 **/
	var RefillGridButton = function(dimensions) {
		this.initialize(dimensions);
	}

	var p = RefillGridButton.prototype = new createjs.Container();
	p.Container_initialize = p.initialize;

	p.initialize = function(dimensions) {
	    console.log("refill_grid_button:initialized");
		this.Container_initialize();
		this.dimensions = dimensions;

		// Setting up the text properties
		var refillGrid = new createjs.Text("Refill Grid", "40px "+config.font, config.numbersColour);
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

		/**
		 *  Refill Grid Click Event - updates the cells and move the button down
		 *  @event onClick
		 **/
		refillGrid.onClick = function(evt) {
			// Refill grid event 
			eventManager.vent.trigger("REFILL_GRID");
		}
		this.addChild(refillGrid);
		eventManager.vent.on("BACKGROUND:RENDER", this.updateButtonPosition, this);
		this.updateButtonPosition();
	}

	// Setting up the button positioning
	RefillGridButton.prototype.updateButtonPosition = function() {
		var middleX = this.dimensions.pageWidth / 2;
		this.x = middleX;
		this.y = this.dimensions.getHeight();
	}
	
	window.RefillGridButton = RefillGridButton;
})();
