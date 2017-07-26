var tutorialEntityFactory = function(gridRepository) {
    var tutorialGridComponent = gridComponent();
    var tutorialBounds = boundsComponent();

    var gridEntity = gridEntityFactory(tutorialGridComponent);
    var cursorEntity = cursorEntityFactory(tutorialGridComponent);
    
    return entity("tutorial", [tutorialBounds], [gridEntity, cursorEntity]);
};