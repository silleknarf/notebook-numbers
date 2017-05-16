var tutorialEntityFactory = function() {
	var tutorialGridComponent = gridComponent();
	var tutorialBounds = boundsComponent();
	tutorialBounds.relative.width = 50;

	var gridEntity = gridEntityFactory(tutorialGridComponent);
	var cursorEntity = cursorEntityFactory(tutorialGridComponent);
	
	return entity("tutorial", [tutorialBounds], [gridEntity, cursorEntity]);
};