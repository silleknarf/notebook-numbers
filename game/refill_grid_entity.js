var refillGridEntityFactory = function() {
	var refillGridViewComponent = refillGridViewComponentFactory();
	var refillGridBoundsComponent = boundsComponent();	
	refillGridBoundsComponent.relative.x = 50;
	refillGridBoundsComponent.relative.y = 90;
	return entity("refillGrid", [refillGridViewComponent, refillGridBoundsComponent]);
};