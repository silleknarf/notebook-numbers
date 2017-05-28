
var init = function() {
	// preload assets
	var preloadSystem = preloadSystemFactory();

	preloadSystem.load(function() { 

		var ecs = entityComponentSystem();

		var cellRepository = cellRepositoryFactory()
		var gridRepository = gridRepositoryFactory(cellRepository);

		gizmoSystem(ecs, eventManager);
		boundsSystem(ecs, eventManager);
		renderSystem(ecs, eventManager, preloadSystem);
		logicSystem(ecs, eventManager, gridRepository);
		cursorSystem(ecs, eventManager, gridRepository, cellRepository);
		cursorViewSystem(ecs, eventManager);
		gridViewSystem(ecs, eventManager);
		scrollSystem(eventManager);
		modeSystem(ecs, eventManager);
		tutorialSystem(ecs, eventManager);

		var backgroundEntity = backgroundEntityFactory();
		ecs.entities.push(backgroundEntity);

		$( document ).ready(function() {
			if (config.isVerticalLayout) {
				$("#header").remove();
				$("#canvas").height("100vh");
			}

			eventManager.vent.trigger("SYSTEM:RENDER:START");
			eventManager.vent.trigger("SYSTEM:BOUNDS:START");

			var hasCompletedTutorial = localStorage.getItem('hasCompletedTutorial');
			if (hasCompletedTutorial)
				eventManager.vent.trigger("SYSTEM:MODE:CLASSIC");
			else 
				eventManager.vent.trigger("SYSTEM:MODE:TUTORIAL");

			// Set up a big grid for testing scroll perf
			eventManager.vent.trigger("SYSTEM:LOGIC:REFILL_GRID");
			eventManager.vent.trigger("SYSTEM:LOGIC:REFILL_GRID");
			eventManager.vent.trigger("SYSTEM:LOGIC:REFILL_GRID");
		});
	});
}
