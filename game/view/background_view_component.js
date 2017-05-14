var backgroundViewComponent = function() {
	var init = function(renderSystem, entity) {
		var bounds = entity.components[componentTypeEnum.BOUNDS];
	    // Set the stage parameters from the dimensions object
		renderSystem.stage.canvas.width = Math.floor(bounds.absolute.width);
		renderSystem.stage.canvas.height = Math.floor(bounds.absolute.height);
		renderSystem.background = new createjs.Container();
		renderSystem.stage.addChild(renderSystem.background);
	};

	var render = function(renderSystem, entity, eventManager) {
		renderSystem.background.removeAllChildren();
		var bounds = entity.components[componentTypeEnum.BOUNDS];

	    // Set the stage parameters from the dimensions object
		renderSystem.stage.canvas.width = Math.floor(bounds.absolute.width);
		renderSystem.stage.canvas.height = Math.floor(bounds.background.absolute.height);

	    var isVerticalLayout = false; // work out from dimensions if we're on a small screen
	    ///var firstPageHeight = this.dimensions.getTop();
		//this.background.removeAllChildren();
		// Draw the outermost cover
		var coverMargin = Math.floor(bounds.absolute.width / 100);
		var cover = new createjs.Shape();
	    var coverWidth = !isVerticalLayout
	        ? bounds.absolute.width 
	        : bounds.absolute.width * 2 + coverMargin * 2 + 20;

		// TODO: scale this appropriately
	    var cornerRadius = 30;
	    cover.graphics
            .beginFill(config.backgroundColour)
            .drawRoundRect(0, 0, coverWidth, bounds.background.absolute.height+cornerRadius, cornerRadius);

		renderSystem.background.addChild(cover);

		var firstPageHeight = bounds.background.absolute.height - (coverMargin * 2);
		var notebookNumbersPage = new createjs.Shape();
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

	    notebookNumbersPage.on("click", function(evt) {
	        eventManager.vent.trigger("CURSOR:CHECK");
	    });

		renderSystem.background.addChild(notebookNumbersPage);

        if (!isVerticalLayout) {
            var titlePage = new createjs.Shape();
            // TODO: Remove unscaled offsets
            titlePage.graphics
                .beginBitmapFill(renderSystem.assets['background'])
                .drawRect(0, 0, Math.floor(bounds.absolute.width/2), bounds.background.absolute.height - 16);
            titlePage.x = Math.floor(bounds.absolute.width/2)+coverMargin+20;
            titlePage.y = coverMargin; 
            titlePage.sourceRect = new createjs.Rectangle(0,0,bounds.absolute.width, bounds.background.absolute.height, 30);
            //renderSystem.background.addChild(titlePage);
        }

		// Draw the banderole on the right hand side
		var banderole = new createjs.Shape();
	    var divisor = isVerticalLayout ? 1 : 2;
	    banderole.graphics
            .beginFill(config.backgroundColour)
            .drawRect(
            	0, 
            	0, 
            	(bounds.absolute.width / divisor), 
            	isVerticalLayout ? bounds.background.absolute.height : bounds.background.absolute.height - 16, 
            	isVerticalLayout ? 0 : 30);

	    banderole.x = isVerticalLayout ? coverMargin : titlePage.x ;
		banderole.y = coverMargin; 
		//renderSystem.background.addChild(banderole);

		// Draw the title banderole on the right hand side
		// TODO: Scale the font based on absolute height
		var fontScalingFactor = 1;
	    var titleTextPosition = isVerticalLayout ? 2 : 4;
		var titleFontSize = 45 * fontScalingFactor * (isVerticalLayout ? 3 : 1);
		var title = new createjs.Text("Notebook Numbers");
	    title.font = Math.ceil(titleFontSize)+"px "+config.titleFont;
	    title.color = config.titleColour;
		title.x = banderole.x + Math.floor(bounds.absolute.width / titleTextPosition);
		title.y = isVerticalLayout ? coverMargin+Math.floor(firstPageHeight/20) : coverMargin+50; 
		title.textAlign = "center";
		renderSystem.background.addChild(title);

		// Draw the bindings in the middle
        if (!isVerticalLayout) {
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
        }
	}

	var self = viewComponent(init, render);
	return self;
}