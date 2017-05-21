var refillGridViewComponentFactory = function() {
	var my = {};

	var getFont = function(absolute) {
		var fontSize = Math.floor(absolute.height);
		var font = fontSize + "px " + config.font;
		return font;
	};

	var getHitArea = function(absolute) {
		var hit = new createjs.Shape();
	    hit.graphics
            .beginFill("#F00")
			.drawRect(0, 0, my.refillGrid.getMeasuredWidth(), absolute.height);
		return hit;
	};

	var init = function(renderSystem, entity, eventManager) {

		var bounds = entity.components[componentTypeEnum.BOUNDS];

		var refillGrid = new createjs.Text("Refill Grid", getFont(bounds.absolute), config.numbersColour);
		refillGrid.x = bounds.absolute.x;
		refillGrid.y = bounds.absolute.y;

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
		my.refillGrid.hitArea = getHitArea(bounds.absolute);
	};

	var remove = function(renderSystem) {
		renderSystem.stage.removeChild(my.refillGrid);
	};

	return viewComponent(init, render, remove);
};
