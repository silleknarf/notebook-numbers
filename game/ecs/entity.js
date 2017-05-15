var entity = function(name, components, subEntities) {
	var my = {};
	my.name = name;
	my.components = {}
	my.subEntities = subEntities || [];

	_.forEach(components, function(component) {
		my.components[component.componentType] = component;
		component.parentEntity = my;
	});

	_.forEach(my.subEntities, function(subEntity) {
		subEntity.parent = my;
	});

	var getComponentNames = function() {
		return _.keys(my.components);
	};

	var hasRequiredComponents = function (requiredComponents) {
		return _.intersection(requiredComponents, getComponentNames()).length === requiredComponents.length;
	};

	my.getComponentNames = getComponentNames;
	my.hasRequiredComponents = hasRequiredComponents;
	return my;
};
