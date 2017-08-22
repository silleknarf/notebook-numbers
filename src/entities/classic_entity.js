var classicEntityFactory = function(gridUtil) {

    // Retrieve existing grid if it exists
    var savedGrid = gridUtil.loadGrid();
    if (!savedGrid)
    {
        var level = eventManager.vent.trigger("SYSTEM:LEVEL:GET_LEVEL");
        savedGrid = level.grid;
        gridUtil.saveGrid(savedGrid);
        eventManager.vent.trigger("SYSTEM:SCORE:RESET");
        eventManager.vent.trigger("SYSTEM:TIMER:RESET")
        // If it's a timed level then start the timer
        if (level.timer) {
            eventManager.vent.trigger(
                "SYSTEM:TIMER:SET", 
                level.timer, 
                "SYSTEM:LOGIC:TIMER_EXPIRED");
        }
    } else {
        eventManager.vent.trigger("SYSTEM:SCORE:LOAD");
        eventManager.vent.trigger("SYSTEM:LEVEL:LOAD");
    }

    var classicGridComponent = gridComponent(savedGrid);

    var classicBounds = boundsComponent();
    //classicBounds.relative.width = config.isVerticalLayout ? 100 : 50;

    var gridEntity = gridEntityFactory(classicGridComponent);
    var cursorEntity = cursorEntityFactory(classicGridComponent);
    var refillGridEntity = refillGridEntityFactory();

    return entity("classic", [classicBounds], [gridEntity, refillGridEntity, cursorEntity]);
};