var tutorialEntityFactory = function() {
	var tutorialGridComponent = gridComponent();
	var tutorialBounds = boundsComponent();

	//tutorialBounds.relative.width = config.isVerticalLayout ? 100 : 50;

	var gridEntity = gridEntityFactory(tutorialGridComponent);
	var cursorEntity = cursorEntityFactory(tutorialGridComponent);
	
	return entity("tutorial", [tutorialBounds], [gridEntity, cursorEntity]);
};