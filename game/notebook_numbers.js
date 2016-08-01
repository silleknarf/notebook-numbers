var ecs = entityComponentSystem();

renderSystem(ecs, eventManager, preloaderMixin);
boundsSystem(ecs, eventManager)

var backgroundEntityComponents = [backgroundViewComponent(), boundsComponent()];
var backgroundEntity = entity("background_view", backgroundEntityComponents)
ecs.entities.push(backgroundEntity);

var init = function() {
	eventManager.vent.trigger("SYSTEM:BOUNDS:START");
	eventManager.vent.trigger("SYSTEM:RENDER:START");
	eventManager.vent.trigger("SYSTEM:MODE:CLASSIC");
};
