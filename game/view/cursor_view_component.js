var cursorViewComponentFactory = function() {
	var my = {};

	var init = function(renderSystem, entity, eventManager) {
		// Draw a black circle below the items currently in the cursor
		var g = new createjs.Graphics();
		g.beginFill(null);
		g.setStrokeStyle(1);
		var navy = createjs.Graphics.getRGB(0,50,102);
		g.beginStroke(navy);
		g.beginFill(null);
		var xOffset = 6;
		var yOffset = 17;
		g.drawCircle(xOffset,yOffset,18);
		my.cursorCircle = new createjs.Shape(g);
		my.cursorCircle2 = new createjs.Shape(g);
		renderSystem.stage.addChild(my.cursorCircle);
		renderSystem.stage.addChild(my.cursorCircle2);
	};

	var render = function(renderSystem, entity, eventManager) {
		var cursor = entity.components[componentTypeEnum.GRID].cursor;

		my.cursorCircle.visible = typeof cursor.cells[0] !== 'undefined';
		my.cursorCircle2.visible = typeof cursor.cells[1] !== 'undefined';

		if (my.cursorCircle.visible) {
			var firstCellBounds = cursor.cells[0][componentTypeEnum.BOUNDS];
			my.cursorCircle.x = firstCellBounds.absolute.x;
			my.cursorCircle.y = firstCellBounds.absolute.y;
		}

		if (my.cursorCircle2.visible) {
			var secondCellBounds = cursor.cells[1][componentTypeEnum.BOUNDS];
			my.cursorCircle2.x = secondCellBounds.absolute.x;
			my.cursorCircle2.y = secondCellBounds.absolute.y;
		}
	};

	var remove = function(renderSystem) {
		renderSystem.stage.removeChild(my.cursorCircle);
		renderSystem.stage.removeChild(my.cursorCircle2);
	};

	return viewComponent(init, render);
};