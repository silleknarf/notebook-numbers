var component = function(componentType) {
	var my = {};
	my.componentType = componentType;
	return my;
};

var componentTypeEnum = Object.freeze({
	VIEW: "view",
	BOUNDS: "bounds",
	GRID: "grid"
});

var viewComponent = function(initFunction, renderFunction) {
	var my = component(componentTypeEnum.VIEW);
	my.init = initFunction;
	my.render = renderFunction;
	return my;
}

var boundsComponent = function() {
	var my = component(componentTypeEnum.BOUNDS);

	var relative = {
		x: 0,
		y: 0,
		width: 100,
		height: 100
	};
	var absolute = {
		x: 0,
		y: 0,
		width: 100,
		height: 100
	};
	my.relative = relative;
	my.absolute = absolute;
	return my;
}

var gridComponent = function(grid) {
	var my = component(componentTypeEnum.GRID);
	my.grid = grid;
	return my;
};