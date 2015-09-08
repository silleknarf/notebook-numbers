/**
 * @module NotebookNumbers
 **/
(function() {

	/** 
	 * Draws the button that refills the grid when you have no more moves to make
	 *
	 * @class BackgroundView
	 **/
	var BackgroundView = function(heightProvider, assets, dimensions) {
		this.initialize(heightProvider, assets, dimensions);
	}
	var p = BackgroundView.prototype = new createjs.Container();
	p.Container_initialize = p.initialize;

	p.initialize = function(heightProvider, assets, dimensions) {
		this.Container_initialize();
	    this.assets = assets;
		this.dimensions = dimensions;

		this.background = new createjs.Container();
		createjs.EventDispatcher.initialize(BackgroundView.prototype);
		this.addChild(this.background);

	    this.heightProvider = heightProvider;
		this.updateCanvas();

		eventManager.vent.on("GRID:HEIGHT_UPDATED", this.updateCanvas, this);
	}


	// This should be moved to background_view and be triggered by an event
	BackgroundView.prototype.updateCanvas = function() {

		this.background.removeAllChildren();
		// Draw the outermost cover
		var coverMargin = 10;
		var cover = new createjs.Shape();

	    var minHeight = Math.max(800, this.heightProvider());
		cover.graphics.beginFill(config.backgroundColour).drawRoundRect(0, 0, this.dimensions.pageWidth*2+coverMargin*2+20, minHeight, 30);
		this.background.addChild(cover);

		var leftPage = new createjs.Shape();
		leftPage.graphics.beginBitmapFill(this.assets['background']).drawRect(0, 0, this.dimensions.pageWidth, minHeight-15, 30);
		leftPage.x = coverMargin;
		leftPage.y = coverMargin;
		leftPage.sourceRect = new createjs.Rectangle(0,0,this.dimensions.pageWidth, minHeight);

		// Click anywhere evaluate cursor
		hit = new createjs.Shape();
		var canvas = document.getElementById("notebooknumbers");
		hit.graphics
		   .beginFill("#F00")
		   .drawRect(0, 0, canvas.width/2, minHeight);
		leftPage.hitArea = hit;
		leftPage.onClick = function(evt) {
			eventManager.vent.trigger("CURSOR:CHECK");
		}

		this.background.addChild(leftPage);

		var rightPage = new createjs.Shape();
		rightPage.graphics.beginBitmapFill(this.assets['background']).drawRect(0, 0, this.dimensions.pageWidth, minHeight-16, 30);
		rightPage.x = this.dimensions.pageWidth+coverMargin+20;
		rightPage.y = coverMargin; 
		rightPage.sourceRect = new createjs.Rectangle(0,0,this.dimensions.pageWidth, minHeight);
		this.background.addChild(rightPage);

		// Draw the banderole on the right hand side
		var banderole = new createjs.Shape();
		banderole.graphics.beginFill(config.backgroundColour).drawRect(0, 0, (this.dimensions.pageWidth/2), minHeight-16, 30);
		banderole.x = rightPage.x + (this.dimensions.pageWidth/2);
		banderole.y = coverMargin; 
		this.background.addChild(banderole);

		// Draw the title banderole on the right hand side
		var titleFontSize = 45 * this.dimensions.fontScalingFactor;
		var title = new createjs.Text("Notebook Numbers", titleFontSize+"px "+config.titleFont, config.titleColour);
		title.x = banderole.x + (this.dimensions.pageWidth/4);
		title.y = coverMargin+50; 
		title.textAlign = "center";
		this.background.addChild(title);

		var buttonFontSize = 40 * this.dimensions.fontScalingFactor;
		//var buttonFontSize = 40;
		var buttonOffset = 100;
		var newGame = new createjs.Text("- New Game", buttonFontSize+"px "+config.titleFont, config.titleColour);
		newGame.x = banderole.x + (this.dimensions.pageWidth/4);
		newGame.y = coverMargin+titleFontSize+buttonOffset; 
		newGame.textAlign = "center";

		// Adding collision detection
		var hit = new createjs.Shape();
		hit.graphics
		    .beginFill("#F00")
		    .drawRect(-newGame.getMeasuredWidth()/2, 0, newGame.getMeasuredWidth(), newGame.getMeasuredHeight());
		newGame.hitArea = hit;
		newGame.onClick = function() {
			eventManager.vent.trigger("NOTEBOOKNUMBERS:NEWGAME");
	   	};
		this.background.addChild(newGame);

		// Draw the title banderole on the right hand side
		var tutorial = new createjs.Text("- Tutorial", buttonFontSize+"px "+config.titleFont, config.titleColour);
		tutorial.x = banderole.x + (this.dimensions.pageWidth / 4);
		tutorial.y = coverMargin+titleFontSize+buttonFontSize+buttonOffset+10; 
		tutorial.textAlign = "center";

		hit = new createjs.Shape();
	    hit.graphics
		   .beginFill("#F00")
		   .drawRect(-tutorial.getMeasuredWidth()/2, 0, tutorial.getMeasuredWidth(), tutorial.getMeasuredHeight());

		tutorial.hitArea = hit;
		tutorial.onClick = function() {
			eventManager.vent.trigger("NOTEBOOKNUMBERS:TUTORIAL");
		};
		this.background.addChild(tutorial);

		// Draw the bindings in the middle
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

		// Resize the canvas
		canvas.height = minHeight;
	}

	window.BackgroundView = BackgroundView;
})();
