var backgroundViewComponent = function() {
	var my = {};

	var init = function(renderSystem, entity) {
		var bounds = entity.components[componentTypeEnum.BOUNDS];
	    
		renderSystem.stage.canvas.width = Math.floor(bounds.absolute.width);
		renderSystem.stage.canvas.height = Math.floor(bounds.absolute.height);
		renderSystem.background = new createjs.Container();
		renderSystem.stage.addChild(renderSystem.background);

		// Draw the bindings in the middle
        var y = 0;
        for (var i = 0; y+(400) < bounds.background.absolute.height; i++) {
            var bindings = new createjs.Bitmap(renderSystem.assets['bindings']);
            bindings.x = Math.floor(bounds.absolute.width/2) - 20;
            y = 10+(i*225);
            bindings.y = y;
            bindings.scaleX = 0.6;
            bindings.scaleY = 0.6;
            renderSystem.background.addChild(bindings);
        }
	};

	var render = function(renderSystem, entity, eventManager) {
		var bounds = entity.components[componentTypeEnum.BOUNDS];
		renderSystem.stage.canvas.width = Math.floor(bounds.absolute.width);
		renderSystem.stage.canvas.height = Math.floor(bounds.background.absolute.height);

	}

	return viewComponent(init, render);
}