var refillGridViewComponentFactory = function() {
	var my = {};

	var getFont = function(absolute) {
		var fontSize = Math.floor(absolute.height);
		var font = fontSize + "px " + config.font;
		return font;
	};

	var init = function(renderSystem, entity, eventManager) {

		var bounds = entity.components[componentTypeEnum.BOUNDS];

		// Setting up the text properties
		var refillGrid = new createjs.Text("Refill Grid", getFont(bounds.absolute), config.numbersColour);
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

		/**
		 *  Refill Grid Click Event - updates the cells and move the button down
		 *  @event onClick
		 **/
	    refillGrid.on("click", function(evt) {
	        eventManager.vent.trigger("SYSTEM:LOGIC:REFILL_GRID");
	    });
	    my.refillGrid = refillGrid;

		renderSystem.stage.addChild(refillGrid);
	};

	var render = function(renderSystem, entity) {
		var bounds = entity.components[componentTypeEnum.BOUNDS];
		my.refillGrid.x = bounds.absolute.x;
		my.refillGrid.y = bounds.absolute.y + Math.floor(bounds.absolute.width/2);
		my.refillGrid.font = getFont(bounds.absolute);
	};

	return viewComponent(init, render);
};
