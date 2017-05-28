var cursorViewComponentFactory = function() {
	var my = {};

	var getCircle = function(width, height) {
		// Draw a black circle below the items currently in the cursor
		var g = new createjs.Graphics();
		g.beginFill(null);
		g.setStrokeStyle(1);
		var navy = createjs.Graphics.getRGB(0,50,102);
		g.beginStroke(navy);
		g.beginFill(null);
		var xOffset = width;
		var yOffset = height;
		var scaleDown = 0.9;
		var radius = Math.floor(width+height)/2*scaleDown;
		g.drawCircle(xOffset, yOffset, radius);
		return new createjs.Shape(g);
	};

	var init = function(renderSystem, entity, eventManager) {
		my.cursorCircle = getCircle(6, 18);
		my.cursorCircle2 = getCircle(6, 18);
		renderSystem.stage.addChild(my.cursorCircle);
		renderSystem.stage.addChild(my.cursorCircle2);
	};

	var render = function(renderSystem, entity, eventManager) {
		var cursor = entity.components[componentTypeEnum.GRID].cursor;

		renderSystem.stage.removeChild(my.cursorCircle);
		renderSystem.stage.removeChild(my.cursorCircle2);


		if (typeof cursor.cells[0] !== 'undefined') {
			var absoluteBounds = cursor.cells[0][componentTypeEnum.BOUNDS].absolute;
			my.cursorCircle = getCircle(absoluteBounds.width/2, absoluteBounds.height/2);
			my.cursorCircle.x = absoluteBounds.x;
			my.cursorCircle.y = absoluteBounds.y;
			renderSystem.stage.addChild(my.cursorCircle);
		}

		if (typeof cursor.cells[1] !== 'undefined') {
			var absoluteBounds = cursor.cells[1][componentTypeEnum.BOUNDS].absolute;
			my.cursorCircle2 = getCircle(absoluteBounds.width/2, absoluteBounds.height/2);
			my.cursorCircle2.x = absoluteBounds.x;
			my.cursorCircle2.y = absoluteBounds.y;
			renderSystem.stage.addChild(my.cursorCircle2);
		}
	};

	var remove = function(renderSystem) {
		renderSystem.stage.removeChild(my.cursorCircle);
		renderSystem.stage.removeChild(my.cursorCircle2);
	};

	return viewComponent(init, render, remove);
};