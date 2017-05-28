var refillGridEntityFactory = function() {
	var refillGridViewComponent = refillGridViewComponentFactory();
	var refillGridBoundsComponent = boundsComponent();	
	refillGridBoundsComponent.relative.x = 0;
	refillGridBoundsComponent.relative.width = 100;
	refillGridBoundsComponent.relative.height = 100/config.numRows;
	return entity("refill_grid", [refillGridViewComponent, refillGridBoundsComponent]);
};