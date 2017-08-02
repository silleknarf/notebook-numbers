var classicEntityFactory = function(gridUtil) {

    // Retrieve existing grid if it exists
    var savedGrid = gridUtil.loadGrid();
    if (!savedGrid)
    {
        savedGrid = eventManager.vent.trigger("SYSTEM:LEVEL:GET").grid;
        gridUtil.saveGrid(savedGrid);
        eventManager.vent.trigger("SYSTEM:SCORE:RESET");
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