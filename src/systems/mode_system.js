var modeSystem = function(ecs, eventManager, gridUtil) {
    var my = {};

    var changeMode = function(modeEntityFactory) {
        var mode = modeEntityFactory(gridUtil);

        eventManager.vent.trigger("SYSTEM:MODE:CHANGE_MODE");

        ecs.removeEntities(my.currentMode);
        ecs.addEntities("grid_background", [mode]);

        my.currentMode = mode.name;

        eventManager.vent.trigger("VIEWSYSTEM:CELLS:GRID_CHANGED");
        eventManager.vent.trigger("SYSTEM:UNDO:CLEAR");
        eventManager.vent.trigger("SYSTEM:BOUNDS:UPDATE");
    };

    var startClassic = function() {
        eventManager.vent.trigger("SYSTEM:SCORE:SHOW")
        changeMode(classicEntityFactory);
    };

    var startTutorial = function() {
        eventManager.vent.trigger("SYSTEM:SCORE:HIDE");
        changeMode(tutorialEntityFactory);
    };

    var getMode = function() {
        this.mode = my.currentMode;
    }

    var initialiseEvents = function() {
        eventManager.vent.on("SYSTEM:MODE:CLASSIC", startClassic);
        eventManager.vent.on("SYSTEM:MODE:TUTORIAL", startTutorial);
        eventManager.vent.on("SYSTEM:MODE:GET", getMode);
    };
    initialiseEvents();
};