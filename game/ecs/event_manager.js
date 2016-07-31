var eventManager = {};
eventManager.vent = Backbone.Events;
<<<<<<< HEAD
eventManager.vent.on("all", function(eventName) {
=======
eventManager.on("all", function(eventName) {
>>>>>>> fe8d1f25a422bf780a9a5e28c7513ef65933b0fa
    console.log(eventName);
});