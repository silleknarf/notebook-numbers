var entityComponentSystem = function() {
	var my = {}
	my.entities = [];

	var walkEntitiesHelper = function(entities, functionDefinition) {
		_.forEach(entities, 
			function(entity) {
				functionDefinition(entity);
				walkEntitiesHelper(entity.subEntities, functionDefinition);
		 	});
	}

	var walkEntities = function(functionDefinition) {
		walkEntitiesHelper(my.entities, functionDefinition);
	};

	var runSystem = function(requiredComponents, systemFunction) {
		// Walk the tree
		walkEntities(function(entity) {
			if (entity.hasRequiredComponents(requiredComponents))
				systemFunction(entity);
		});
	};

	var addEntity = function(parentEntityName, entityToAdd) {
		walkEntities(function(entity) {
			if (entity.name === parentEntityName) {
				entity.subEntities.push(entityToAdd);
			}
		});
	};

	var addEntities = function(parentEntityName, entitiesToAdd) {
		_.forEach(entitiesToAdd, function(entity) {
			addEntity(parentEntityName, entity);
		});
		eventManager.vent.trigger("SYSTEM:BOUNDS:UPDATE");
	};

	var removeEntity = function(entityName) {
		walkEntities(function(entity) {
			_.remove(
				entity.subEntities,
				function(subEntity) {
					return subEntity.name === entityName;
				});
		});
	};

	my.runSystem = runSystem;
	my.addEntities = addEntities;
	my.removeEntity = removeEntity;
	return my;
};
