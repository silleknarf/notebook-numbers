var cursorViewComponentFactory = function() {
	var my = this;

	var init = function(renderSystem, entity, eventManager) {
		// Draw a black circle below the items currently in the cursor
		var g = new createjs.Graphics();
		g.beginFill(null);
		g.setStrokeStyle(1);
		var navy = createjs.Graphics.getRGB(0,50,102);
		g.beginStroke(navy);
		g.beginFill(null);
		g.drawCircle(0,0,18);
		my.cursorCircle = new createjs.Shape(g);
		my.cursorCircle2 = new createjs.Shape(g);
		renderSystem.stage.addChild(my.cursorCircle);
		renderSystem.stage.addChild(my.cursorCircle2);
	};

	var render = function(renderSystem, entity, eventManager) {
		var cursor = entity.components[componentTypeEnum.GRID].cursor;

		my.cursorCircle.visible = cursor.cells[0] === true;
		my.cursorCircle2.visible = cursor.cells[1] === true;

		if (my.cursorCircle.visible) {
			var firstCellBounds = cursor.cells[0][componentTypeEnum.BOUNDS];
			my.cursorCircle.x = firstCellBounds.x;
			my.cursorCircle.y = firstCellBounds.y;
		}

		if (my.cursorCircle2.visible) {
			var secondCellBounds = cursor.cells[1][componentTypeEnum.BOUNDS];
			my.cursorCircle2.x = secondCellBounds.x;
			my.cursorCircle2.y = secondCellBounds.y;
		}
	};
	return viewComponent(init, render);
};