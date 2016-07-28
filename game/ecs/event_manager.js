var eventManager = {};
eventManager.vent = Backbone.Events;
eventManager.on("all", function(eventName) {
    console.log(eventName);
});