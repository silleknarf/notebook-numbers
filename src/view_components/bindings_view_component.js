var bindingsViewComponent = function() {
	var my = {};

	my.bindings = [];

    var init = function() { 
    };

	// Draw the bindings in the middle
	var updateBindings = function(renderSystem, bounds) {
        var y = 0;
        var i = 0;

        for (i = 0; y+(400) < bounds.background.absolute.height; i++) {
            var bindings = null
            if (my.bindings[i]) {
            	// Updating existing binding
            	bindings = my.bindings[i];
            } else {
            	// Adding new binding
            	bindings = new createjs.Bitmap(renderSystem.assets['bindings']);
            	my.bindings[i] = bindings;
            	renderSystem.stage.addChild(bindings);
            }

            bindings.x = Math.floor(bounds.absolute.x + bounds.absolute.width / 2);
            y = 10+(i*225);
            bindings.y = y;
            bindings.scaleX = bounds.absolute.width / bindings.image.width;
            bindings.scaleY = 0.6;
        }

        // remove the superfluous bindings
        var toRemoveFrom = i;
        while (i < my.bindings.length) {
        	var bindingToRemove = my.bindings[i];
            renderSystem.stage.removeChild(bindingToRemove);
        	i++;
        }
        // Cull backing array of bindings
        if (toRemoveFrom >= 0) {
        	my.bindings.length = toRemoveFrom;
        }
	}

	var render = function(renderSystem, entity, eventManager) {
		var bounds = entity.components[componentTypeEnum.BOUNDS];
		
		updateBindings(renderSystem, bounds);
	}

	var remove = function(renderSystem) {
		_.forEach(
			my.bindings,
			function(binding) {
            	renderSystem.stage.removeChild(bindings);
			})	
	}

	return viewComponent(init, render, remove);
};
