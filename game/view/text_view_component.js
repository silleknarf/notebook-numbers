var textViewComponent = function() {
	var my = {};

	var getFont = function(absolute) {
		var fontSize = Math.floor(absolute.height * 0.5);
		var font = fontSize + "px " + config.font;
		return font;
	};

	var init = function(renderSystem, entity) {

		var bounds = entity.components[componentTypeEnum.BOUNDS];

		var text = entity.components[componentTypeEnum.TEXT].text;

		// Setting up the text properties
		var textView = new createjs.Text(text, getFont(bounds.absolute), config.numbersColour);
		textView.x = bounds.absolute.x;
		textView.y = bounds.absolute.y;
	    my.textView = textView;

		renderSystem.stage.addChild(textView);
	};

	var render = function(renderSystem, entity, eventManager) {
		var bounds = entity.components[componentTypeEnum.BOUNDS];
		my.textView.x = bounds.absolute.x;
		my.textView.y = bounds.absolute.y; 
		my.textView.font = getFont(bounds.absolute);
	};

	var remove = function(renderSystem) {
		renderSystem.stage.removeChild(my.textView);
	};
	

	return viewComponent(init, render, remove);
};