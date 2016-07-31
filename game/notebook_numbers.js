var ecs = entityComponentSystem();

<<<<<<< HEAD
renderSystem(ecs, eventManager, preloaderMixin);
boundsSystem(ecs, eventManager)

var backgroundEntityComponents = [backgroundViewComponent(), boundsComponent()];
var backgroundEntity = entity("background_view", backgroundEntityComponents)
ecs.entities.push(backgroundEntity);

var init = function() {
	eventManager.vent.trigger("SYSTEM:BOUNDS:START");
	eventManager.vent.trigger("SYSTEM:RENDER:START");
};
=======
renderSystem(ecs, eventManager, preloader);
boundsSystem(ecs, eventManager)

var backgroundEntityComponents = [backgroundViewComponent()];
var backgroundEntity = entity(backgroundEntityComponents)
ecs.entities.push(backgroundEntity);

eventManager.vent.trigger("SYSTEM:BOUNDS:START");
eventManager.vent.trigger("SYSTEM:RENDER:START");
>>>>>>> fe8d1f25a422bf780a9a5e28c7513ef65933b0fa
