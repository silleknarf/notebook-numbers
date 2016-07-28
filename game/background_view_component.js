var backgroundViewComponent = function() {
	var init = function(entity) {
		var bounds = entity.components[componentTypeEnum.BOUNDS];
	    // Set the stage parameters from the dimensions object
		my.stage.canvas.width = Math.floor(bounds.absolute.width);
		console.log("Inital width: "+this.stage.canvas.width+"px");
		my.background = new createjs.Container();
		my.stage.addChild(background);

	};

	var render = function(entity) {
		my.background.removeAllChildren();
		var bounds = entity.components[componentTypeEnum.BOUNDS];
	    var isVerticalLayout = false; // work out from dimensions if we're on a small screen
	    ///var firstPageHeight = this.dimensions.getTop();
		//this.background.removeAllChildren();
		// Draw the outermost cover
		var coverMargin = bounds.dimensions.absolute.width / 10;
		var cover = new createjs.Shape();
	    var coverWidth = isVerticalLayout
	        ? bounds.absolute.width - (coverMargin * 2)
	        : this.dimensions.pageWidth * 2 + coverMargin * 2 + 20;

		// TODO: scale this appropriately
	    var cornerRadius = 30;
	    cover.graphics
            .beginFill(config.backgroundColour)
            .drawRoundRect(0, 0, coverWidth, bounds.absolute.height, cornerRadius);

		my.background.addChild(cover);

		var firstPageHeight = bounds.absolute.height - (coverMargin * 2);
		var notebookNumbersPage = new createjs.Shape();
		notebookNumbersPage.graphics
            .beginBitmapFill(my.assets['background'])
            .drawRect(0, 0, bounds.absolute.width, firstPageHeight, 30);

		notebookNumbersPage.x = coverMargin;
		notebookNumbersPage.y = coverMargin + firstPageHeight;
		notebookNumbersPage.sourceRect = new createjs.Rectangle(
            0,
            0,
            bounds.absolute.width,
            bounds.absolute.height
            );

		// Click anywhere evaluate cursor
		var hit = new createjs.Shape();
		var canvas = document.getElementById("notebooknumbers");
		hit.graphics
		   .beginFill("#F00")
		   .drawRect(0, 0, bounds.absolute.width/2, bounds.absolute.height);
		notebookNumbersPage.hitArea = hit;

	    notebookNumbersPage.on("click", function(evt) {
	        eventManager.vent.trigger("CURSOR:CHECK");
	    });

		my.background.addChild(notebookNumbersPage);

        if (!isVerticalLayout) {
            var titlePage = new createjs.Shape();
            // TODO: Remove unscaled offsets
            titlePage.graphics
                .beginBitmapFill(my.assets['background'])
                .drawRect(0, 0, bounds.absolute.width/2, bounds.absolute.height - 16);
            titlePage.x = bounds.absolute.width+coverMargin+20;
            titlePage.y = coverMargin; 
            titlePage.sourceRect = new createjs.Rectangle(0,0,bounds.absolute.width, bounds.absolute.height, 30);
            this.background.addChild(titlePage);
        }

		// Draw the banderole on the right hand side
		var banderole = new createjs.Shape();
	    var divisor = isVerticalLayout ? 1 : 2;
	    banderole.graphics
            .beginFill(config.backgroundColour)
            .drawRect(0, 0, (this.dimensions.pageWidth / divisor), isVerticalLayout ? firstPageHeight : minHeight - 16, isVerticalLayout ? 0 : 30);
	    banderole.x = (isVerticalLayout ? coverMargin : titlePage.x + (this.dimensions.pageWidth/2));
		banderole.y = coverMargin; 
		this.background.addChild(banderole);

		// Draw the title banderole on the right hand side
	    var titleTextPosition = isVerticalLayout ? 2 : 4;
		var titleFontSize = 45 * this.dimensions.fontScalingFactor * (isVerticalLayout ? 3 : 1);
		var title = new createjs.Text("Notebook Numbers");
	    title.font = Math.ceil(titleFontSize)+"px "+config.titleFont;
	    title.color = config.titleColour;
		title.x = banderole.x + (this.dimensions.pageWidth / titleTextPosition);
		title.y = isVerticalLayout ? coverMargin+firstPageHeight/20 : coverMargin+50; 
		title.textAlign = "center";
		this.background.addChild(title);

		var buttonFontSize = 40 * this.dimensions.fontScalingFactor * (isVerticalLayout ? 3 : 1);
		//var buttonFontSize = 40;
		var buttonOffset = isVerticalLayout ? firstPageHeight / 8 : 100;
		var newGame = new createjs.Text("- New Game");
	    newGame.font = Math.ceil(buttonFontSize)+"px "+config.titleFont;
	    newGame.color = config.titleColour;
		newGame.x = banderole.x + (this.dimensions.pageWidth / titleTextPosition);
		newGame.y = coverMargin+titleFontSize+buttonOffset; 
		newGame.textAlign = "center";

		// Adding collision detection
		var hit = new createjs.Shape();
		hit.graphics
		    .beginFill("#F00")
		    .drawRect(-newGame.getMeasuredWidth()/2, 0, newGame.getMeasuredWidth(), newGame.getMeasuredHeight());
		newGame.hitArea = hit;
		newGame.on("click", function() {
			eventManager.vent.trigger(events.newGame);
	   	});
		this.background.addChild(newGame);

		// Draw the title banderole on the right hand side
		var tutorial = new createjs.Text("- Tutorial");
	    tutorial.font = Math.ceil(buttonFontSize)+"px "+config.titleFont;
	    tutorial.color = config.titleColour;
		tutorial.x = banderole.x + (this.dimensions.pageWidth / titleTextPosition);
		tutorial.y = coverMargin+titleFontSize+buttonFontSize+buttonOffset+10; 
		tutorial.textAlign = "center";

		hit = new createjs.Shape();
	    hit.graphics
		   .beginFill("#F00")
		   .drawRect(-tutorial.getMeasuredWidth()/2, 0, tutorial.getMeasuredWidth(), tutorial.getMeasuredHeight());

		tutorial.hitArea = hit;
		tutorial.on("click", function() {
			eventManager.vent.trigger(events.tutorial);
		});
		this.background.addChild(tutorial);

		// Draw the bindings in the middle
        if (!isVerticalLayout) {
            var y = 0;
            for (var i = 0; y < minHeight; i++) {
                var bindings = new createjs.Bitmap(this.assets['bindings']);
                bindings.x = this.dimensions.pageWidth - 20;
                y = 10+(i*225);
                bindings.y = y;
                bindings.scaleX = 0.6;
                bindings.scaleY = 0.6;
                this.background.addChild(bindings);
            }
        }
	}
	var my = viewComponent(init, render);
	return my;
}