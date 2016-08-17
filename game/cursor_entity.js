var cursorEntityFactory = function(gridComponent) {
	var cursorViewComponent = cursorViewComponentFactory();
	return entity("cursor", [cursorViewComponent, gridComponent]);
};