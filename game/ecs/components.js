// This repository allows us to create GUIDs which 
// we can use as component ids
var componentIdRepository = (function() {
	var my = this;
	my.nextId = 1;
	my.getNextId = function() {
		var nextId = my.nextId;
		my.nextId++;
		return nextId;
	}
	return my;
})();

var component = function(componentType) {
	var my = {};
	my.id = componentIdRepository.getNextId();
	my.componentType = componentType;
	return my;
};

var componentTypeEnum = Object.freeze({
	VIEW: "view",
	BOUNDS: "bounds",
	GRID: "grid",
	CELL: "cell",
	TEXT: "text"
});

var viewComponent = function(initFunction, renderFunction, removeFunction) {
	var my = component(componentTypeEnum.VIEW);
	my.init = initFunction;
	my.render = renderFunction;
	my.remove = removeFunction;
	return my;
}

var boundsComponent = function(relative) {
	var my = component(componentTypeEnum.BOUNDS);

	if (!relative) {
		relative = {
			x: 0,
			y: 0,
			width: 100,
			height: 100
		};
	}
	var absolute = {
		x: 0,
		y: 0,
		width: 100,
		height: 100
	};
	my.relative = relative;
	my.absolute = absolute;
	my.originalRelative = _.cloneDeep(relative);
	
	return my;
}

var gridComponent = function(grid) {
	var my = component(componentTypeEnum.GRID);
	my.grid = grid || [];
	my.cursor = {
        cells: []
	};

	return my;
};

var cellComponent = function(i, j, digit) {
	var my = component(componentTypeEnum.CELL);
	my.i = i;
	my.j = j;
	my.digit = digit;
	return my;
};

var textComponent = function(text) {
	var my = component(componentTypeEnum.TEXT);
	my.text = text;
	return my;
};