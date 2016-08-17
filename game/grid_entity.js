var gridEntityFactory = function(gridComponent) {
	var gridBoundsComponent = boundsComponent();
	gridBoundsComponent.relative = {
		x: 5,
		y: 5,
		width: 50,
		height: 90
	};

	var gridComponents = [gridComponent, gridBoundsComponent];

	return entity("grid", gridComponents);
};