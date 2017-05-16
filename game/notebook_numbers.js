var ecs = entityComponentSystem();

var cellRepository = cellRepositoryFactory()
var gridRepository = gridRepositoryFactory(cellRepository);

renderSystem(ecs, eventManager, preloaderMixin);
boundsSystem(ecs, eventManager);
logicSystem(ecs, eventManager, gridRepository);
cursorSystem(ecs, eventManager, gridRepository, cellRepository);
cursorViewSystem(ecs, eventManager);
gridViewSystem(ecs, eventManager);
scrollSystem(eventManager);
gizmoSystem(ecs, eventManager);
modeSystem(ecs, eventManager);
tutorialSystem(ecs, eventManager);

// TODO: Move these to a background entity factory
var backgroundEntityComponents = [backgroundViewComponent(), boundsComponent()];
var backgroundEntity = entity("background_view", backgroundEntityComponents);
ecs.entities.push(backgroundEntity);

var titleBoundsComponent = boundsComponent({ x: 50, y: 0, width: 50, height: 20});
var titleEntityComponents = [titleViewComponent(), titleBoundsComponent];
var titleEntity = entity("title", titleEntityComponents);

var menuBoundsComponent = boundsComponent({ x: 50, y: 20, width: 50, height: 20});
var menuEntityComponents = [menuViewComponent(), menuBoundsComponent];
var menuEntity = entity("menu", menuEntityComponents);

ecs.addEntities("background_view", [titleEntity, menuEntity]);

var init = function() {
	eventManager.vent.trigger("SYSTEM:RENDER:START");
	eventManager.vent.trigger("SYSTEM:BOUNDS:START");

	var hasCompletedTutorial = localStorage.getItem('hasCompletedTutorial');
	if (hasCompletedTutorial)
		eventManager.vent.trigger("SYSTEM:MODE:CLASSIC");
	else 
		eventManager.vent.trigger("SYSTEM:MODE:TUTORIAL");
};