var refillGridEntityFactory = function() {
	var refillGridViewComponent = refillGridViewComponentFactory();
	var refillGridBoundsComponent = boundsComponent();	
	refillGridBoundsComponent.relative.x = 35;
	refillGridBoundsComponent.relative.width = 30;
	refillGridBoundsComponent.relative.height = 100/config.numRows;
	return entity("refill_grid", [refillGridViewComponent, refillGridBoundsComponent]);
};