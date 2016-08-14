var cellViewComponent = function() {
	var my = this;

	var init = function(renderSystem, entity) {
		var absolute = entity.components[componentTypeEnum.BOUNDS].absolute;
		var number = entity.components[componentTypeEnum.NUMBER];
		var numberView = new createjs.Text(
			number.digit, 
			"30px "+config.font, 
			config.backgroundColour);
		//numberView.textAlign = "center";
		numberView.x = absolute.x;
		numberView.y = absolute.y;
		numberView.digit = number.digit;
		my.numberView = numberView;
		renderSystem.stage.addChild(numberView);
		renderSystem.stage.setChildIndex(numberView, renderSystem.stage.getNumChildren()-1);	
	};

	var render = function(renderSystem, entity, eventManager) {
		var absolute = entity.components[componentTypeEnum.BOUNDS].absolute;
		my.numberView.x = absolute.x;
		my.numberView.y = absolute.y;
	};

	return viewComponent(init, render);
};