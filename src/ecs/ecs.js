var entityComponentSystem = function() {
	var my = {}
	my.entities = [];

	var walkEntitiesHelper = function(entities, functionDefinition) {
		_.forEach(entities, 
			function(entity) {
				if (!entity)
					return;
				var shouldContinue = functionDefinition(entity);
				if (shouldContinue)
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
			return true;
		});
	};

	var runSystemOnce = function(requiredComponents, systemFunction) {
		// Walk the tree
		var shouldContinue = true;
		walkEntities(function(entity) {
			if (entity.hasRequiredComponents(requiredComponents)) {
				systemFunction(entity);
				shouldContinue = false;
			}
			return shouldContinue;
		});
	};

	var addEntity = function(parentEntityName, entityToAdd) {
		var shouldContinue = true;
		walkEntities(function(entity) {
			if (entity.name === parentEntityName) {
				entityToAdd.parent = entity;
				entity.subEntities.push(entityToAdd);
				shouldContinue = false;	
			}
			return shouldContinue;
		});
	};

	var addEntities = function(parentEntityName, entitiesToAdd) {
		_.forEach(entitiesToAdd, function(entity) {
			addEntity(parentEntityName, entity);
		});
	};

	var removeEntities = function(entityName) {
		walkEntities(function(entity) {
			_.remove(
				entity.subEntities,
				function(subEntity) {
					return subEntity.name === entityName;
				});
			return true;
		});
	};

	var removeEntitiesById = function(entitiesToRemove) {
		var entityIdsToRemove = _(entitiesToRemove)
			.map(function(entity) { return entity.id })
			.keyBy()
			.mapValues(function() { return true; })
			.value();

		walkEntities(function(entity) {
			_.remove(
				entity.subEntities,
				function(subEntity) {
					return entityIdsToRemove[subEntity.id] === true;
				});
			return true;
		});
	};

	my.runSystem = runSystem;
	my.runSystemOnce = runSystemOnce;
	my.addEntities = addEntities;
	my.removeEntities = removeEntities;
	my.removeEntitiesById = removeEntitiesById;
	return my;
};
