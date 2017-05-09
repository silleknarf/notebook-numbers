var ecs = entityComponentSystem();

var cellRepository = cellRepositoryFactory()
var gridRepository = gridRepositoryFactory(cellRepository);

renderSystem(ecs, eventManager, preloaderMixin);
boundsSystem(ecs, eventManager);
logicSystem(ecs, eventManager, gridRepository);
cursorSystem(ecs, eventManager, gridRepository, cellRepository);
cursorViewSystem(ecs, eventManager);
cellsViewSystem(ecs, eventManager);

var backgroundEntityComponents = [backgroundViewComponent(), boundsComponent()];
var backgroundEntity = entity("background_view", backgroundEntityComponents);
ecs.entities.push(backgroundEntity);
ecs.addEntities("background_view", [classicEntity()]);

var init = function() {
	eventManager.vent.trigger("SYSTEM:MODE:CLASSIC");
	// TODO: move this to the classic system start
	eventManager.vent.trigger("VIEWSYSTEM:CELLS:GRID_CHANGED");

	eventManager.vent.trigger("SYSTEM:RENDER:START");
	eventManager.vent.trigger("SYSTEM:BOUNDS:START");
};
