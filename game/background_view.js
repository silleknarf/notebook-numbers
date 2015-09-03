/**
 * @module NotebookNumbers
 **/
(function() {

	/** 
	 * Draws the button that refills the grid when you have no more moves to make
	 *
	 * @class BackgroundView
	 **/
	var BackgroundView = function(heightProvider, assets) {
		this.initialize(heightProvider, assets);
	}
	var p = BackgroundView.prototype = new createjs.Container();
	p.Container_initialize = p.initialize;

	p.initialize = function(heightProvider, assets) {
		this.Container_initialize();
	    this.assets = assets;

		this.background = new createjs.Container();
		this.addChild(this.background);

	    this.heightProvider = heightProvider;
		this.updateCanvas();

		//this.stage.addChildAt(background,0);
		eventManager.vent.on("GRID:HEIGHT_UPDATED", this.updateCanvas, this);
	}


	// This should be moved to background_view and be triggered by an event
	BackgroundView.prototype.updateCanvas = function() {

		this.background.removeAllChildren();
		// Draw the outermost cover
		var coverMargin = 10;
		var cover = new createjs.Shape();

		//var blue = "#000066";
		var navy = "#003266";
	    var minHeight = Math.max(800, this.heightProvider());
		cover.graphics.beginFill(navy).drawRoundRect(0, 0, config.width*2+coverMargin*2+20, minHeight, 30);
		//cover.graphics.beginFill(navy).drawRoundRect(0, 0, config.width, minHeight, 30);
		this.background.addChild(cover);

		//var leftPage = new createjs.Bitmap(app.assets['background']);
		var leftPage = new createjs.Shape();
		leftPage.graphics.beginBitmapFill(this.assets['background']).drawRect(0, 0, config.width, minHeight-15, 30);
		leftPage.x = coverMargin;
		leftPage.y = coverMargin;
		leftPage.sourceRect = new createjs.Rectangle(0,0,config.width, minHeight);

		this.background.addChild(leftPage);

		var rightPage = new createjs.Shape();
		rightPage.graphics.beginBitmapFill(this.assets['background']).drawRect(0, 0, config.width, minHeight-16, 30);
		rightPage.x = config.width+coverMargin+20;
		rightPage.y = coverMargin; 
		rightPage.sourceRect = new createjs.Rectangle(0,0,config.width, minHeight);
		this.background.addChild(rightPage);

		// Draw the banderole on the right hand side
		var banderole = new createjs.Shape();
		banderole.graphics.beginFill(navy).drawRect(0, 0, (config.width/2), minHeight-16, 30);
		banderole.x = rightPage.x + (config.width/2);
		banderole.y = coverMargin; 
		this.background.addChild(banderole);

		// Draw the title banderole on the right hand side
		var gold = "#FDD017";
		var titleFontSize = 50;
		var title = new createjs.Text("Notebook Numbers", titleFontSize+"px Yellowtail", gold);
		title.x = banderole.x + (config.width/4);
		title.y = coverMargin+50; 
		title.textAlign = "center";
		this.background.addChild(title);

		var buttonFontSize = 36;
		var buttonOffset = 100;
		var newGame = new createjs.Text("- New Game", buttonFontSize+"px Yellowtail", gold);
		newGame.x = banderole.x + (config.width/4);
		newGame.y = coverMargin+titleFontSize+buttonOffset; 
		newGame.textAlign = "center";

		// Adding collision detection
		var hit = new createjs.Shape();
		hit.graphics
		    .beginFill("#F00")
		    .drawRect(-newGame.getMeasuredWidth()/2, 0, newGame.getMeasuredWidth(), newGame.getMeasuredHeight()+10);
		newGame.hitArea = hit;
		newGame.onClick = function(evt) {
	       		eventManager.vent.trigger("NOTEBOOKNUMBERS:NEWGAME");
	   	};
		this.addChild(newGame);

		// Draw the title banderole on the right hand side
		var tutorial = new createjs.Text("- Tutorial", buttonFontSize+"px Yellowtail", gold);
		tutorial.x = banderole.x + (config.width / 4);
		tutorial.y = coverMargin+titleFontSize+buttonFontSize+buttonOffset+10; 
		tutorial.textAlign = "center";

		hit = new createjs.Shape();
	    	hit.graphics
            	   .beginFill("#F00")
		   .drawRect(-tutorial.getMeasuredWidth()/2, 0, tutorial.getMeasuredWidth(), tutorial.getMeasuredHeight()+10);

		tutorial.hitArea = hit;
		tutorial.onClick = function() {
			eventManager.vent.trigger("NOTEBOOKNUMBERS:TUTORIAL");
	    	};
		this.addChild(tutorial);

		/*
		var facebookDiv = document.getElementById("facebook");
		var facebook = new createjs.DOMElement(facebookDiv);
		facebook.x = banderole.x + (config.width / 4) + 63;
		facebook.y = -300; // coverMargin+titleFontSize+buttonFontSize+buttonOffset+50; 
		this.addChild(facebook);
		*/

		// Draw the bindings in the middle
		var y = 0;
		for (var i = 0; y < minHeight; i++) {
			var bindings = new createjs.Bitmap(this.assets['bindings']);
			bindings.x = config.width - 20;
			y = 10+(i*225);
			bindings.y = y;
			bindings.scaleX = 0.6;
			bindings.scaleY = 0.6;
			//bindings.sourceRect = new createjs.Rectangle(0,0,20,30);
			this.background.addChild(bindings);
		}

		// Click anywhere evaluate cursor
		hit = new createjs.Shape();
		var canvas = document.getElementById("notebooknumbers");
		hit.graphics
		   .beginFill("#F00")
		   .drawRect(0, 0, canvas.width/2, minHeight);
		this.background.hitArea = hit;
		this.background.onClick = function(evt) {
			eventManager.vent.trigger("CURSOR:CHECK");
		}

		// Resize the canvas
		canvas.height = minHeight;
	}

	window.BackgroundView = BackgroundView;
})();
