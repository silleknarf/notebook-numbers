var ecs = entityComponentSystem();

var cellRepository = cellRepositoryFactory()
var gridRepository = gridRepositoryFactory(cellRepository);

gizmoSystem(ecs, eventManager);
renderSystem(ecs, eventManager, preloaderMixin);
boundsSystem(ecs, eventManager);
logicSystem(ecs, eventManager, gridRepository);
cursorSystem(ecs, eventManager, gridRepository, cellRepository);
cursorViewSystem(ecs, eventManager);
gridViewSystem(ecs, eventManager);
scrollSystem(eventManager);
modeSystem(ecs, eventManager);
tutorialSystem(ecs, eventManager);

var backgroundEntity = backgroundEntityFactory();
ecs.entities.push(backgroundEntity);

var init = function() {
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
}
