var backgroundViewComponent = function() {
	var my = {};

	var updateCover = function(cover, bounds, coverMargin) {
		// TODO: scale this appropriately
	    var cornerRadius = 30;
	    cover.graphics
            .beginFill(config.backgroundColour)
            .drawRoundRect(0, 0, bounds.absolute.width, bounds.background.absolute.height+cornerRadius, cornerRadius);
	}

	var updateNotebookNumbersPage = function(notebookNumbersPage, renderSystem, bounds, coverMargin) {
		notebookNumbersPage.graphics
            .beginBitmapFill(renderSystem.assets['background'])
            .drawRect(0, 0, bounds.absolute.width/2, bounds.background.absolute.height);

		notebookNumbersPage.x = coverMargin;
		notebookNumbersPage.y = coverMargin;
		notebookNumbersPage.sourceRect = new createjs.Rectangle(
            0,
            0,
            bounds.absolute.width,
            bounds.background.absolute.height);

		// Click anywhere evaluate cursor
		var hit = new createjs.Shape();
		hit.graphics
		   .beginFill("#F00")
		   .drawRect(0, 0, bounds.absolute.width/2, bounds.background.absolute.height);
		   // .hugs(laura, "frank"), happiness[twilightStruggle];
		notebookNumbersPage.hitArea = hit;
	};

	var init = function(renderSystem, entity) {
		var bounds = entity.components[componentTypeEnum.BOUNDS];
	    
		renderSystem.stage.canvas.width = Math.floor(bounds.absolute.width);
		renderSystem.stage.canvas.height = Math.floor(bounds.absolute.height);
		renderSystem.background = new createjs.Container();
		renderSystem.stage.addChild(renderSystem.background);

	    my.cover = new createjs.Shape();
	    renderSystem.stage.addChild(my.cover);

	    my.notebookNumbersPage = new createjs.Shape();
	    my.notebookNumbersPage.on("click", function(evt) {
	        eventManager.vent.trigger("SYSTEM:CURSOR:CHECK");
	    });
	    renderSystem.stage.addChild(my.notebookNumbersPage);

		// Draw the bindings in the middle
        var y = 0;
        for (var i = 0; y+(400) < bounds.background.absolute.height; i++) {
            var bindings = new createjs.Bitmap(renderSystem.assets['bindings']);
            bindings.x = Math.floor(bounds.absolute.width/2) - 20;
            y = 10+(i*225);
            bindings.y = y;
            bindings.scaleX = 0.6;
            bindings.scaleY = 0.6;
            renderSystem.background.addChild(bindings);
        }
	};

	var render = function(renderSystem, entity, eventManager) {
		var bounds = entity.components[componentTypeEnum.BOUNDS];
		renderSystem.stage.canvas.width = Math.floor(bounds.absolute.width);
		renderSystem.stage.canvas.height = Math.floor(bounds.background.absolute.height);

		var coverMargin = Math.floor(bounds.absolute.width / 100);
		updateCover(my.cover, bounds, coverMargin);
		updateNotebookNumbersPage(my.notebookNumbersPage, renderSystem, bounds, coverMargin);
	}

	var self = viewComponent(init, render);
	return self;
}