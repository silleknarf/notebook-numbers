var cellViewComponent = function() {
	var my = {};

	var init = function(renderSystem, entity) {
		var absolute = entity.components[componentTypeEnum.BOUNDS].absolute;
		var number = entity.components[componentTypeEnum.CELL];
		var numberView = new createjs.Text(
			number.digit, 
			"30px "+config.font, 
			config.backgroundColour);
		numberView.textAlign = "center";
		numberView.digit = number.digit;
		numberView.visible = numberView.digit !== 0;

		// Create a hitbox for each number
		var hit = new createjs.Shape();
		var colourValue = number.digit * 16;
		hit.graphics
			.beginFill("rgba(" + colourValue + "," + colourValue + "," + colourValue + ", 0.5)")
			.drawRect(0, 0, absolute.width, absolute.height);

		// Because we shift the center of the cell into the middle of it's 
		// co-ords we need to adjust the hit box accordingly
		hit.x = -Math.floor(absolute.width/2);
		hit.y = -Math.floor(absolute.height/2) + 15;
		numberView.hitArea = hit;

	    numberView.on("click", function(evt) {
	        eventManager.vent.trigger("SYSTEM:CURSOR:CHECK", number);
	    });
	    numberView.on("mouseover", function(evt) {
	        eventManager.vent.trigger("SYSTEM:CURSOR:ADD", number);
	    });
			
		my.numberView = numberView;
		//renderSystem.stage.addChild(hit);
		renderSystem.stage.addChild(numberView);
		renderSystem.stage.setChildIndex(numberView, renderSystem.stage.getNumChildren()-1);	
	};

	var render = function(renderSystem, entity, eventManager) {
		var absolute = entity.components[componentTypeEnum.BOUNDS].absolute;
		my.numberView.x = absolute.x + Math.floor(absolute.width/2);
		my.numberView.y = absolute.y + Math.floor(absolute.height/2) - 15;
		//my.numberView.x = absolute.x;
		//my.numberView.y = absolute.y;
	};

	var remove = function(renderSystem) {
		renderSystem.stage.removeChild(my.numberView);
	};

	return viewComponent(init, render, remove);
};