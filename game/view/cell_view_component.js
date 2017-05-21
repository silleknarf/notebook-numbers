var cellViewComponent = function() {
	var my = {};

	var getFont = function(absolute) {
		var numberFontSize = Math.floor(absolute.height);
		var font = numberFontSize + "px " +config.font;
		return font;
	}

	var init = function(renderSystem, entity) {

		var absolute = entity.components[componentTypeEnum.BOUNDS].absolute;
		var number = entity.components[componentTypeEnum.CELL];
		var numberView = new createjs.Text(
			number.digit, 
			getFont(absolute),
			config.backgroundColour);
		numberView.textAlign = "center";
		numberView.digit = number.digit;
		numberView.visible = numberView.digit !== 0;
		//numberView.setBounds(absolute.x, absolute.y, absolute.width, absolute.height);

		// Create a hitbox for each number
		var hit = new createjs.Shape();
		var colourValue = number.digit * 16;
		hit.graphics
			//.moveTo(absolute.x, absolute.y)
			.beginFill("rgba(" + colourValue + "," + colourValue + "," + colourValue + ", 0.5)")
			.drawRect(-absolute.width/2, 0, absolute.width, absolute.height);

		numberView.hitArea = hit;

	    numberView.on("click", function(evt) {
	        eventManager.vent.trigger("SYSTEM:CURSOR:CHECK", number);
	    });
	    numberView.on("mouseover", function(evt) {
	        eventManager.vent.trigger("SYSTEM:CURSOR:ADD", number);
	    });
			
		my.numberView = numberView;
		renderSystem.stage.addChild(numberView);
		renderSystem.stage.setChildIndex(numberView, renderSystem.stage.getNumChildren()-1);	
	};

	var render = function(renderSystem, entity, eventManager) {
		var absolute = entity.components[componentTypeEnum.BOUNDS].absolute;
		my.numberView.x = absolute.x + Math.floor(absolute.width/2);
		my.numberView.y = absolute.y;
		my.numberView.font = getFont(absolute);
	};

	var remove = function(renderSystem) {
		renderSystem.stage.removeChild(my.numberView);
	};

	return viewComponent(init, render, remove);
};