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

		// Adding collision detection
		var hit = new createjs.Shape();
	    hit.graphics
            .beginFill("#F00")
			.drawRect(0, 0, 
					 	bounds.absolute.width, bounds.absolute.height);
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
		var middle = Math.floor(bounds.absolute.width/2 - my.refillGrid.getMeasuredWidth()/2);
		my.refillGrid.x = bounds.absolute.x + middle;
		my.refillGrid.y = bounds.absolute.y; //+ Math.floor(bounds.absolute.width/2);
		my.refillGrid.font = getFont(bounds.absolute);
	};

	var remove = function(renderSystem) {
		renderSystem.stage.removeChild(my.refillGrid);
	};

	return viewComponent(init, render, remove);
};
