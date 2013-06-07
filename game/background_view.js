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

		var background = new createjs.Container();
		// Draw the outermost cover
		var coverMargin = 10;
		var cover = new createjs.Shape();

		//var blue = "#000066";
		var navy = "#003266";
		var minHeight = Math.max(height, 2600);
		cover.graphics.beginFill(navy).drawRoundRect(0, 0, width*2+coverMargin*2+20, minHeight, 30);
		//cover.graphics.beginFill(navy).drawRoundRect(0, 0, width, minHeight, 30);
		background.addChild(cover);

		var leftPage = new createjs.Bitmap(app.assets['background']);
		leftPage.x = coverMargin;
		leftPage.y = coverMargin;
		leftPage.sourceRect = new createjs.Rectangle(0,0,width, minHeight);

		background.addChild(leftPage);

		var rightPage = new createjs.Bitmap(app.assets['background']);
		rightPage.x = width+coverMargin+20;
		rightPage.y = coverMargin; 
		rightPage.sourceRect = new createjs.Rectangle(0,0,width, minHeight);
		background.addChild(rightPage);

		// Draw the banderole on the right hand side
		var banderole = new createjs.Shape();
		banderole.graphics.beginFill(navy).drawRect(0, 0, (width/2), minHeight, 30);
		banderole.x = rightPage.x + (width/2);
		banderole.y = coverMargin; 
		background.addChild(banderole);

		// Draw the bindings in the middle
		for (var i = 0; i < 5; i++) {
			var bindings = new createjs.Bitmap(app.assets['bindings']);
			bindings.x = width - 20;
			bindings.y = 10+(i*225);
			bindings.scaleX = 0.6;
			bindings.scaleY = 0.6;
			//bindings.sourceRect = new createjs.Rectangle(0,0,20,30);
			background.addChild(bindings);
		}
		this.addChild(background);
		//this.stage.addChildAt(background,0);
	}

	window.BackgroundView = BackgroundView;
})();
