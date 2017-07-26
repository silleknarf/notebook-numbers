var eventManager = {};
eventManager.vent = Backbone.Events;
eventManager.vent.on("all", function(eventName) {
    console.log(eventName);
});