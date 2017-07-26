var classicEntityFactory = function(gridRepository) {
    var generateClassicGrid = function() {
        var data = [[], [], []];
        var firstRow = data[0];
        var secondRow = data[1];
        var thirdRow = data[2];
        for (var i = 1; i<=config.numColumns; i++) {
            firstRow[i-1] = i;
            if (i%2==1) {
                secondRow[i-1] = 1;
            } else {
                secondRow[i-1] = i/2;
            }
            if (config.numColumns%2==1) {
                if (i%2==1) {
                    thirdRow[i-1] = (i/2)+((config.numColumns/2)+1)-1;
                } else {
                    thirdRow[i-1] = 1;
                }   
            } else {
                if (i%2==1) {
                    thirdRow[i-1] = 1;
                } else {
                    thirdRow[i-1] = (i/2)+((config.numColumns/2)+1)-1;
                }   
            }
        }
        return data;
    };

    // Retrieve existing grid if it exists
    var savedGrid = gridRepository.loadGrid();
    if (!savedGrid)
    {
        savedGrid = generateClassicGrid();
        gridRepository.saveGrid(savedGrid);
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