var refillGridEntityFactory = function() {
	var refillGridViewComponent = refillGridViewComponentFactory();
	var refillGridBoundsComponent = boundsComponent();	
	refillGridBoundsComponent.relative.x = 50;
	refillGridBoundsComponent.relative.width = 10;
	refillGridBoundsComponent.relative.height = 10;
	return entity("refillGrid", [refillGridViewComponent, refillGridBoundsComponent]);
};