var ecs = entityComponentSystem();

renderSystem(ecs, eventManager, preloader);
boundsSystem(ecs, eventManager)

var backgroundEntityComponents = [backgroundViewComponent()];
var backgroundEntity = entity(backgroundEntityComponents)
ecs.entities.push(backgroundEntity);

eventManager.vent.trigger("SYSTEM:BOUNDS:START");
eventManager.vent.trigger("SYSTEM:RENDER:START");
