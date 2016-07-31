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
<<<<<<< HEAD
			if (entity.hasRequiredComponents(requiredComponents))
				systemFunction(entity);
=======
			// get entity components
			var components = entity.getComponentNames();
			if (entity.hasRequiredComponents(requiredComponents))
			{
				systemFunction(entity);
			}
>>>>>>> fe8d1f25a422bf780a9a5e28c7513ef65933b0fa
		});
	};

	my.runSystem = runSystem;
	return my;
};
