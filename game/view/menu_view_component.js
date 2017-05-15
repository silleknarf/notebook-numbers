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

		var buttonOffset = 100;
		var newGame = new createjs.Text("- New Game");

	    newGame.font = getFont(absolute);
	    newGame.color = config.titleColour;

		// Adding collision detection
		var hitNewGame = new createjs.Shape();
		hitNewGame.graphics
			.moveTo(absolute.x, absolute.y)
		    .beginFill("#F00")
		    .drawRect(0, 0, newGame.getMeasuredWidth(), newGame.getMeasuredHeight());

		newGame.hitArea = hitNewGame;
		newGame.on("click", function() {
			eventManager.vent.trigger("SYSTEM:MODE:CLASSIC");
	   	});
		renderSystem.stage.addChild(newGame);

		// Draw the title banderole on the right hand side
		var tutorial = new createjs.Text("- Tutorial");
	    tutorial.font = getFont(absolute);
	    tutorial.color = config.titleColour;

		var hitTutorial = new createjs.Shape();
	    hitTutorial.graphics
			.moveTo(absolute.x, absolute.y)
		   	.beginFill("#F00")
		   	.drawRect(0, 0, tutorial.getMeasuredWidth(), tutorial.getMeasuredHeight());

		tutorial.hitArea = hitTutorial;
		tutorial.on("click", function() {
			eventManager.vent.trigger("SYSTEM:MODE:TUTORIAL");
		});
		renderSystem.stage.addChild(tutorial);
		my.newGame = newGame;
		my.tutorial = tutorial;
	};

	var render = function(renderSystem, entity, eventManager) {
		var bounds = entity.components[componentTypeEnum.BOUNDS];
		var middle = Math.floor(bounds.absolute.width/2 - my.newGame.getMeasuredWidth()/2);
		my.newGame.x = bounds.absolute.x + middle;
		my.newGame.y = bounds.absolute.y; 
		my.tutorial.x = bounds.absolute.x + middle;
		my.tutorial.y = bounds.absolute.y + bounds.absolute.height / 2; 
		var font = getFont(bounds.absolute);
		my.newGame.font = font;
		my.tutorial.font = font;
	}

	var remove = function(renderSystem) {

	};

	return viewComponent(init, render, remove);
};