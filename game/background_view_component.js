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
	    var isVerticalLayout = false; // work out from dimensions if we're on a small screen
	    ///var firstPageHeight = this.dimensions.getTop();
		//this.background.removeAllChildren();
		// Draw the outermost cover
		var coverMargin = Math.floor(bounds.absolute.width / 100);
		var cover = new createjs.Shape();
	    var coverWidth = !isVerticalLayout
	        ? bounds.absolute.width - (coverMargin * 2)
	        : bounds.absolute.width * 2 + coverMargin * 2 + 20;

		// TODO: scale this appropriately
	    var cornerRadius = 30;
	    cover.graphics
            .beginFill(config.backgroundColour)
            .drawRoundRect(0, 0, coverWidth, bounds.absolute.height, cornerRadius);

		renderSystem.background.addChild(cover);

		var firstPageHeight = bounds.absolute.height - (coverMargin * 2);
		var notebookNumbersPage = new createjs.Shape();
		notebookNumbersPage.graphics
            .beginBitmapFill(renderSystem.assets['background'])
            .drawRect(0, 0, bounds.absolute.width/2, firstPageHeight, 30);

		notebookNumbersPage.x = coverMargin;
		notebookNumbersPage.y = coverMargin;
		notebookNumbersPage.sourceRect = new createjs.Rectangle(
            0,
            0,
            bounds.absolute.width,
            bounds.absolute.height);

		// Click anywhere evaluate cursor
		var hit = new createjs.Shape();
		var canvas = document.getElementById("notebooknumbers");
		hit.graphics
		   .beginFill("#F00")
		   .drawRect(0, 0, bounds.absolute.width/2, bounds.absolute.height);
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
                .drawRect(0, 0, Math.floor(bounds.absolute.width/2), bounds.absolute.height - 16);
            titlePage.x = Math.floor(bounds.absolute.width/2)+coverMargin+20;
            titlePage.y = coverMargin; 
            titlePage.sourceRect = new createjs.Rectangle(0,0,bounds.absolute.width, bounds.absolute.height, 30);
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
            	isVerticalLayout ? bounds.absolute.height : bounds.absolute.height - 16, 
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

		var buttonFontSize = 40 * fontScalingFactor * (isVerticalLayout ? 3 : 1);
		//var buttonFontSize = 40;
		var buttonOffset = isVerticalLayout ? Math.floor(firstPageHeight / 8) : 100;
		var newGame = new createjs.Text("- New Game");
	    newGame.font = Math.ceil(buttonFontSize)+"px "+config.titleFont;
	    newGame.color = config.titleColour;
		newGame.x = banderole.x + Math.floor(bounds.absolute.width / titleTextPosition);
		newGame.y = coverMargin+titleFontSize+buttonOffset; 
		newGame.textAlign = "center";

		// Adding collision detection
		var hit = new createjs.Shape();
		hit.graphics
		    .beginFill("#F00")
		    .drawRect(-Math.floor(newGame.getMeasuredWidth()/2), 0, newGame.getMeasuredWidth(), newGame.getMeasuredHeight());
		newGame.hitArea = hit;
		newGame.on("click", function() {
			eventManager.vent.trigger(events.newGame);
	   	});
		renderSystem.background.addChild(newGame);

		// Draw the title banderole on the right hand side
		var tutorial = new createjs.Text("- Tutorial");
	    tutorial.font = Math.ceil(buttonFontSize)+"px "+config.titleFont;
	    tutorial.color = config.titleColour;
		tutorial.x = banderole.x + Math.floor(bounds.absolute.width / titleTextPosition);
		tutorial.y = coverMargin+titleFontSize+buttonFontSize+buttonOffset+10; 
		tutorial.textAlign = "center";

		hit = new createjs.Shape();
	    hit.graphics
		   .beginFill("#F00")
		   .drawRect(-Math.floor(tutorial.getMeasuredWidth()/2), 0, tutorial.getMeasuredWidth(), tutorial.getMeasuredHeight());

		tutorial.hitArea = hit;
		tutorial.on("click", function() {
			eventManager.vent.trigger(events.tutorial);
		});
		renderSystem.background.addChild(tutorial);

		// Draw the bindings in the middle
        if (!isVerticalLayout) {
            var y = 0;
            for (var i = 0; y < bounds.absolute.height; i++) {
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