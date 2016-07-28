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
			// get entity components
			var components = entity.getComponentNames();
			if (entity.hasRequiredComponents(requiredComponents))
			{
				systemFunction(entity);
			}
		});
	};

	my.runSystem = runSystem;
	return my;
};
