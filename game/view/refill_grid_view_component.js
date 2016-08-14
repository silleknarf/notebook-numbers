var refillGridViewComponentFactory = function() {
	var init = function(renderSystem, entity, eventManager) {

		var bounds = entity.components[componentTypeEnum.BOUNDS];
		// Setting up the text properties
		var refillGrid = new createjs.Text("Refill Grid", "40px "+config.font, config.numbersColour);
		refillGrid.x = bounds.absolute.x;
		refillGrid.y = bounds.absolute.y;
		refillGrid.textAlign = "center";

		// Adding collision detection
		var hit = new createjs.Shape();
	    hit.graphics
            .beginFill("#F00")
			.drawRect(	-refillGrid.getMeasuredWidth()/2, 0, 
					 	refillGrid.getMeasuredWidth(), refillGrid.getMeasuredHeight());
		refillGrid.hitArea = hit;

		// Set the height of the button as a property
	    //this.height = refillGrid.getMeasuredHeight();

		/**
		 *  Refill Grid Click Event - updates the cells and move the button down
		 *  @event onClick
		 **/
	    refillGrid.on("click", function(evt) {
	        // Refill grid event 
	        eventManager.vent.trigger("SYSTEM:LOGIC:REFILL_GRID");
	    });

		renderSystem.stage.addChild(refillGrid);
	};
	var render = function() {

	};
	return viewComponent(init, render);
};
