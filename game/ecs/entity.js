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
<<<<<<< HEAD
	});

	var getComponentNames = function() {
		return _.keys(my.components);
	};

	var hasRequiredComponents = function (requiredComponents) {
		return _.intersection(requiredComponents, getComponentNames()).length === requiredComponents.length;
	};
=======
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
>>>>>>> fe8d1f25a422bf780a9a5e28c7513ef65933b0fa

	my.getComponentNames = getComponentNames;
	my.hasRequiredComponents = hasRequiredComponents;
	return my;
};
