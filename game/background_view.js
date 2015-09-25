/**
 * @module NotebookNumbers
 **/
(function() {

	/** 
	 * Draws the button that refills the grid when you have no more moves to make
	 *
	 * @class BackgroundView
	 **/
	var BackgroundView = function(assets, dimensions) {
	    this.assets = assets;
		this.dimensions = dimensions;
		this.initialize();
	}

    BackgroundView.events = {
        render: "BACKGROUND:RENDER"
    };

	var p = BackgroundView.prototype = new createjs.Container();

	p.Container_initialize = p.initialize;

	p.initialize = function() {
		this.Container_initialize();
		this.background = new createjs.Container();

		createjs.EventDispatcher.initialize(BackgroundView.prototype);

		this.addChild(this.background);

		this.render();

		eventManager.vent.on(BackgroundView.events.render, this.render, this);
	}


	// This should be moved to background_view and be triggered by an event
	BackgroundView.prototype.render = function() {

	    var isVerticalLayout = this.dimensions.isVerticalLayout;
	    var firstPageHeight = this.dimensions.getTop();
		this.background.removeAllChildren();
		// Draw the outermost cover
		var coverMargin = 10;
		var cover = new createjs.Shape();

	    var minHeight = Math.max(800, this.dimensions.getBottom());
	    var coverWidth = isVerticalLayout
	        ? this.dimensions.fullWidth - (coverMargin * 2)
	        : this.dimensions.pageWidth * 2 + coverMargin * 2 + 20;

	    cover.graphics
            .beginFill(config.backgroundColour)
            .drawRoundRect(0, 0, coverWidth, minHeight, 30);

		this.background.addChild(cover);

		var notebookNumbersPage = new createjs.Shape();
		notebookNumbersPage.graphics
            .beginBitmapFill(this.assets['background'])
            .drawRect(0, 0, this.dimensions.pageWidth, minHeight - firstPageHeight - 15, 30);
		notebookNumbersPage.x = coverMargin;
		notebookNumbersPage.y = coverMargin + firstPageHeight;
		notebookNumbersPage.sourceRect = new createjs.Rectangle(
            0,
            0,
            this.dimensions.pageWidth,
            minHeight + this.dimensions.getBottom());

		// Click anywhere evaluate cursor
		hit = new createjs.Shape();
		var canvas = document.getElementById("notebooknumbers");
		hit.graphics
		   .beginFill("#F00")
		   .drawRect(0, 0, canvas.width/2, minHeight);
		notebookNumbersPage.hitArea = hit;

	    notebookNumbersPage.on("click", function(evt) {
	        eventManager.vent.trigger("CURSOR:CHECK");
	    });

		this.background.addChild(notebookNumbersPage);

        if (!isVerticalLayout) {
            var titlePage = new createjs.Shape();
            titlePage.graphics
                .beginBitmapFill(this.assets['background'])
                .drawRect(0, 0, this.dimensions.pageWidth, minHeight - 16);
            titlePage.x = this.dimensions.pageWidth+coverMargin+20;
            titlePage.y = coverMargin; 
            titlePage.sourceRect = new createjs.Rectangle(0,0,this.dimensions.pageWidth, minHeight, 30);
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

		// Resize the canvas
		canvas.height = minHeight;
	}

	window.BackgroundView = BackgroundView;
})();
