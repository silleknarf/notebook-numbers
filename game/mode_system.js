var modeSystem = function(ecs, eventManager) {
	var currentMode = null;

	var changeMode = function(modeEntityFactory) {
		var mode = modeEntityFactory();
		ecs.addEntity("background", mode);
		ecs.removeEntity("mode");
		currentMode = mode.name;
	};

	var startClassic = function() {
		changeMode(classicEntityFactory);
	};

	var startTutorial = function() {
		changeMode(tutorialEntityFactory);
	};

	var initialiseEvents = function() {
		eventManager.vent.on(
			"SYSTEM:MODE:CLASSIC", 
			startClassic);
		eventManager.vent.on(
			"SYSTEM:MODE:TUTORIAL", 
			startTutorial);
	};
	initialiseEvents();
};