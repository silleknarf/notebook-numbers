var refillGridEntityFactory = function() {
	var refillGridViewComponent = refillGridViewComponentFactory();
	var refillGridBoundsComponent = boundsComponent();	
	refillGridBoundsComponent.relative.x = 50;
	refillGridBoundsComponent.relative.y = 20;
	return entity("refillGrid", [refillGridViewComponent, refillGridBoundsComponent]);
};