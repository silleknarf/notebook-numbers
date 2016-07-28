var entity = function(name, components, subEntities) {
	var my = {};
	my.name = name;
	my.components = {}
	my.subEntities = subEntities || [];

	_.forEach(components, function(component) {
		my.components[component.componentType] = component;
	});

	_.forEach(my.subEntities, function(subEntity) {
		subEntity.parent = my;
	})

	var getComponentNames = function() {
		return _.forOwn(my.components, function(value, key) {
			return key;
		});
	}

	var hasRequiredComponents = function (requiredComponents) {
		var componentNames = _.map(
			getComponents(), 
			function(component) { return component.name; });
		return _.intersect([requiredComponents, componentNames]).length === requiredComponents.length;
	}

	my.getComponentNames = getComponentNames;
	my.hasRequiredComponents = hasRequiredComponents;
	return my;
};
