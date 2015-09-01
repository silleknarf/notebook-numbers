/**
 * @module NotebookNumbers
 **/
(function () {
    /**
     * Add Backbone.js events
     *
     * @method vent
     * @extends Backbone.Events
     **/
    var eventManager = {};
    eventManager.vent = Backbone.Events;
    window.eventManager = eventManager;
})();
