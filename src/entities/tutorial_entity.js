var tutorialEntityFactory = function(gridUtil) {
    var tutorialGridComponent = gridComponent();
    var tutorialBounds = boundsComponent();

    var gridEntity = gridEntityFactory(tutorialGridComponent);
    var cursorEntity = cursorEntityFactory(tutorialGridComponent);
    
    return entity("tutorial", [tutorialBounds], [gridEntity, cursorEntity]);
};