/**
 * @module NotebookNumbers
 **/
(function() {

	/** 
	 * Draws the button that refills the grid when you have no more moves to make
	 *
	 * @class BackgroundView
	 **/
	var BackgroundView = function(width, height) {
		this.initialize(width, height);
	}
	var p = BackgroundView.prototype = new createjs.Container();
	p.Container_initialize = p.initialize;

	p.initialize = function(width, height) {
		this.Container_initialize();

		this.background = new createjs.Container();
		this.addChild(this.background);

		this.updateCanvas();
		this.width = width;

		//this.stage.addChildAt(background,0);
		NotebookNumbers.vent.on("GRID:HEIGHT_UPDATED", this.updateCanvas, this);
	}


	// This should be moved to background_view and be triggered by an event
	BackgroundView.prototype.updateCanvas = function() {

		this.background.removeAllChildren();
		// Draw the outermost cover
		var coverMargin = 10;
		var cover = new createjs.Shape();

		//var blue = "#000066";
		var navy = "#003266";
		var minHeight = app.getBottom();
		cover.graphics.beginFill(navy).drawRoundRect(0, 0, this.width*2+coverMargin*2+20, minHeight, 30);
		//cover.graphics.beginFill(navy).drawRoundRect(0, 0, this.width, minHeight, 30);
		this.background.addChild(cover);

		//var leftPage = new createjs.Bitmap(app.assets['background']);
		var leftPage = new createjs.Shape();
		leftPage.graphics.beginBitmapFill(app.assets['background']).drawRect(0, 0, this.width, minHeight-15, 30);
		leftPage.x = coverMargin;
		leftPage.y = coverMargin;
		leftPage.sourceRect = new createjs.Rectangle(0,0,this.width, minHeight);

		this.background.addChild(leftPage);

		var rightPage = new createjs.Shape();
		rightPage.graphics.beginBitmapFill(app.assets['background']).drawRect(0, 0, this.width, minHeight-16, 30);
		rightPage.x = this.width+coverMargin+20;
		rightPage.y = coverMargin; 
		rightPage.sourceRect = new createjs.Rectangle(0,0,this.width, minHeight);
		this.background.addChild(rightPage);

		// Draw the banderole on the right hand side
		var banderole = new createjs.Shape();
		banderole.graphics.beginFill(navy).drawRect(0, 0, (this.width/2), minHeight-16, 30);
		banderole.x = rightPage.x + (this.width/2);
		banderole.y = coverMargin; 
		this.background.addChild(banderole);

		// Draw the title banderole on the right hand side
		/*
		font-family: 'Lovers Quarrel', cursive;
		font-family: 'Yellowtail', cursive;
		font-family: 'Londrina Solid', cursive;
		font-family: 'Mr Dafoe', cursive;
		font-family: 'Annie Use Your Telescope', cursive;
		*/
		var gold = "#FDD017";
		var title = new createjs.Text("Notebook Numbers", "50px Yellowtail", gold);
		title.x = banderole.x + (this.width/4);
		title.y = coverMargin+50; 
		title.textAlign = "center";
		this.background.addChild(title);

		// Draw the bindings in the middle
		var y = 0;
		for (var i = 0; y < minHeight; i++) {
			var bindings = new createjs.Bitmap(app.assets['bindings']);
			bindings.x = this.width - 20;
			y = 10+(i*225);
			bindings.y = y;
			bindings.scaleX = 0.6;
			bindings.scaleY = 0.6;
			//bindings.sourceRect = new createjs.Rectangle(0,0,20,30);
			this.background.addChild(bindings);
		}

		// Click anywhere evaluate cursor
		var hit = new createjs.Shape();
		var canvas = document.getElementById("notebooknumbers");
		hit.graphics.beginFill("#F00").drawRect(0, 0, canvas.width, minHeight);
		this.background.hitArea = hit;
		this.background.onClick = function(evt) {
			NotebookNumbers.vent.trigger("CURSOR:CHECK");
		}

		// Resize the canvas
		var canvas = document.getElementById("notebooknumbers");
		canvas.height = minHeight;

		// TODO: Resize the bindings and the cover
	}

	window.BackgroundView = BackgroundView;
})();
