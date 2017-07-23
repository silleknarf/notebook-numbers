var menuViewComponent = function() {
	var my = {};

	var getFont = function(absolute) {
		var menuItemsCount = 2;
		var fontSize = Math.floor(absolute.height / (menuItemsCount + 1));
		var font = fontSize + "px " + config.titleFont;
		return font;
	};
	
	var init = function(renderSystem, entity, eventManager) {

		var view = entity.components[componentTypeEnum.BOUNDS];
		var absolute = view.absolute;

		var newGame = new createjs.Text("- New Game");

	    newGame.font = getFont(absolute);
	    newGame.color = config.titleColour;

		// Adding collision detection
		var hitNewGame = new createjs.Shape();
		hitNewGame.graphics
		    .beginFill("#F00")
		    .drawRect(0, 0, newGame.getMeasuredWidth()*1.1, newGame.getMeasuredHeight() * 1.5);

		newGame.hitArea = hitNewGame;
		newGame.on("click", function() {
			eventManager.vent.trigger("SYSTEM:MODE:CLASSIC");
	   	});
		renderSystem.stage.addChild(newGame);

		var tutorial = new createjs.Text("- Tutorial");
	    tutorial.font = getFont(absolute);
	    tutorial.color = config.titleColour;

		var hitTutorial = new createjs.Shape();
	    hitTutorial.graphics
		   	.beginFill("#F00")
		   	.drawRect(0, 0, tutorial.getMeasuredWidth()*1.1, tutorial.getMeasuredHeight() * 1.5);

		tutorial.hitArea = hitTutorial;
		tutorial.on("click", function() {
			eventManager.vent.trigger("SYSTEM:MODE:TUTORIAL");
		});
		renderSystem.stage.addChild(tutorial);

		var scoreComponent = entity.components[componentTypeEnum.SCORE];
		var score = new createjs.Text("Score: " + scoreComponent.score);
	    score.font = getFont(absolute);
	    score.color = config.titleColour;
		renderSystem.stage.addChild(score);

		my.newGame = newGame;
		my.tutorial = tutorial;
		my.score = score;
	};

	var render = function(renderSystem, entity, eventManager) {
		var bounds = entity.components[componentTypeEnum.BOUNDS];
		var middle = Math.floor(bounds.absolute.width/2 - my.newGame.getMeasuredWidth()/2);
		my.newGame.x = bounds.absolute.x + middle;
		my.newGame.y = bounds.absolute.y; 
		my.tutorial.x = bounds.absolute.x + middle;
		my.tutorial.y = bounds.absolute.y + bounds.absolute.height / 3; 

		middle = Math.floor(bounds.absolute.width/2 - my.score.getMeasuredWidth()/2);
		my.score.x = bounds.absolute.x + middle;
		my.score.y = bounds.absolute.y + bounds.absolute.height * 3 / 4; 

		var font = getFont(bounds.absolute);
		my.newGame.font = font;
		my.tutorial.font = font;
		my.score.font = font;
		my.score.text = "Score: " + entity.components[componentTypeEnum.SCORE].score;

		/*  TODO: Make the hitboxes update dynamically
		var outline = new createjs.Graphics();
		outline.setStrokeStyle(1);
		outline.beginStroke("white");
		outline.moveTo(my.newGame.x, my.newGame.y);
		outline.lineTo(my.newGame.x+my.newGame.hitArea.graphics.command.w, my.newGame.y);
		outline.lineTo(my.newGame.x+my.newGame.hitArea.graphics.command.w, my.newGame.y+my.newGame.hitArea.graphics.command.h);
		outline.lineTo(my.newGame.x, my.newGame.y+my.newGame.hitArea.graphics.command.h);
		outline.lineTo(my.newGame.x, my.newGame.y);
		var outlineShape = new createjs.Shape(outline);
		renderSystem.stage.addChild(outlineShape);
		renderSystem.stage.setChildIndex(outlineShape, renderSystem.stage.getNumChildren()-1);	
		*/
	}

	var remove = function(renderSystem) {
		renderSystem.stage.removeChild(my.newGame);
		renderSystem.stage.removeChild(my.tutorial);
		renderSystem.stage.removeChild(my.score);
	};

	return viewComponent(init, render, remove);
};