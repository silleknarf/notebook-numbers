var classicEntityFactory = function(gridUtil) {

    // Retrieve existing grid if it exists
    var savedGrid = gridUtil.loadGrid();
    if (!savedGrid)
    {
        savedGrid = getLevel(2);
        gridUtil.saveGrid(savedGrid);
        eventManager.vent.trigger("SYSTEM:SCORE:RESET");
    } else {
        eventManager.vent.trigger("SYSTEM:SCORE:LOAD");
    }

    var classicGridComponent = gridComponent(savedGrid);

    var classicBounds = boundsComponent();
    //classicBounds.relative.width = config.isVerticalLayout ? 100 : 50;

    var gridEntity = gridEntityFactory(classicGridComponent);
    var cursorEntity = cursorEntityFactory(classicGridComponent);
    var refillGridEntity = refillGridEntityFactory();

    return entity("classic", [classicBounds], [gridEntity, refillGridEntity, cursorEntity]);
};