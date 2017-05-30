var coverViewComponent = function() {
	var my = {};

	var updateCover = function(cover, bounds, coverMargin) {
		// TODO: scale this appropriately
	    var cornerRadius = 30;

	    my.coverGraphics = new createjs.Graphics();
	    if (config.isVerticalLayout) {
		    my.coverGraphics
	            .beginFill(config.backgroundColour)
	            .drawRect(0, 0, bounds.absolute.width, bounds.background.absolute.height);
	    } else {
		    my.coverGraphics
	            .beginFill(config.backgroundColour)
	            .drawRoundRect(0, 0, bounds.absolute.width, bounds.background.absolute.height, cornerRadius);
	    }

	    cover.graphics = my.coverGraphics;
	}

	var init = function(renderSystem, entity) {
		var bounds = entity.components[componentTypeEnum.BOUNDS];

	    my.cover = new createjs.Shape();
	    renderSystem.stage.addChild(my.cover);
	};

	var render = function(renderSystem, entity, eventManager) {
		var bounds = entity.components[componentTypeEnum.BOUNDS];
		var coverMargin = Math.floor(bounds.absolute.width / 100);
		
		updateCover(my.cover, bounds, coverMargin);
	}

	return viewComponent(init, render);
};