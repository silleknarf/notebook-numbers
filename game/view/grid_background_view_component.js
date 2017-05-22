var gridBackgroundViewComponent = function() {
	var my = {};

	var updateGridBackgroundView = function(gridBackgroundView, renderSystem, bounds, coverMargin) {

		var width = bounds.absolute.width-2*coverMargin;
		my.backgroundGraphics = new createjs.Graphics();
		my.backgroundGraphics
            .beginBitmapFill(renderSystem.assets['background'])
            .drawRect(0, bounds.absolute.y, width, bounds.background.absolute.height);
      	gridBackgroundView.graphics = my.backgroundGraphics;

		gridBackgroundView.x = coverMargin;
		gridBackgroundView.y = coverMargin;
		gridBackgroundView.sourceRect = new createjs.Rectangle(
            0,
            0,
            width,
            bounds.background.absolute.height);

		// Click anywhere evaluate cursor
		my.hit = new createjs.Shape();
		my.hitGraphics = new createjs.Graphics();
		my.hitGraphics
			.beginFill("#F00")
		   	.drawRect(0, 0, width, bounds.background.absolute.height);
		my.hit.graphics = my.hitGraphics;
		   // .hugs(laura, "frank"), happiness[twilightStruggle];
		gridBackgroundView.hitArea = my.hit;
	};

	var init = function(renderSystem, entity) {
		var bounds = entity.components[componentTypeEnum.BOUNDS];

	    my.gridBackgroundView = new createjs.Shape();
	    my.gridBackgroundView.on("click", function(evt) {
	        eventManager.vent.trigger("SYSTEM:CURSOR:CHECK");
	    });
	    renderSystem.stage.addChild(my.gridBackgroundView);
	};

	var render = function(renderSystem, entity, eventManager) {
		var bounds = entity.components[componentTypeEnum.BOUNDS];

		var coverMargin = Math.floor(bounds.absolute.width / 100);
		updateGridBackgroundView(my.gridBackgroundView, renderSystem, bounds, coverMargin);
	}

	return viewComponent(init, render);
};