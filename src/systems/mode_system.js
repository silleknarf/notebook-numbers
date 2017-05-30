var modeSystem = function(ecs, eventManager, gridRepository) {
	var my = {};

	var changeMode = function(modeEntityFactory) {
		var mode = modeEntityFactory(gridRepository);

		eventManager.vent.trigger("SYSTEM:MODE:CHANGE_MODE");

		ecs.removeEntities(my.currentMode);
		ecs.addEntities("grid_background", [mode]);

		my.currentMode = mode.name;

		eventManager.vent.trigger("VIEWSYSTEM:CELLS:GRID_CHANGED");
		eventManager.vent.trigger("SYSTEM:BOUNDS:UPDATE");
	};

	var startClassic = function() {
		changeMode(classicEntityFactory);
	};

	var startTutorial = function() {
		changeMode(tutorialEntityFactory);
	};

	var initialiseEvents = function() {
		eventManager.vent.on("SYSTEM:MODE:CLASSIC", startClassic);
		eventManager.vent.on("SYSTEM:MODE:TUTORIAL", startTutorial);
	};
	initialiseEvents();
};