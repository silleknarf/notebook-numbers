// This repository allows us to create GUIDs which 
// we can use as entity ids
var entityIdRepository = (function() {
	var my = this;
	my.nextId = 1;
	my.getNextId = function() {
		var nextId = my.nextId;
		my.nextId++;
		return nextId;
	}
	return my;
})();

var entity = function(name, components, subEntities) {
	var my = {};
	my.name = name;
	my.id = entityIdRepository.getNextId();
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
