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
			var components = entity.getComponents();
			if (entity.hasRequiredComponents(requiredComponents))
			{
				//if (entityFunctionName)
					//entity[entityFunctionName](components, system);
				if (systemFunction)
					systemFunction(entity, components);
			}
		});
	};

	my.runSystem = runSystem;
	return my;
};

var entity = function(name, components, subEntities) {
	var my = {};
	my.name = name;
	my.components = {}
	my.subEntities = subEntities || [];

	_.forEach(components, function(component) {
		my.components[component.name] = component;
	});

	_.forEach(my.subEntities, function(subEntity) {
		subEntity.parent = my;
	})

	var getComponents = function() {
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

	my.getComponents = getComponents
	my.hasRequiredComponents = hasRequiredComponents;
	return my;
};

var component = function(componentType) {
	var my = {};
	my.componentType = componentType;
	return my;
};

var componentTypeEnum = Object.freeze({
	VIEW: "view",
	BOUNDS: "bounds"
}V);

var viewComponent = function(renderFunction) {
	var my = component(componentTypeEnum.VIEW);
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

var backgroundViewComponent = viewComponent(function(bounds) {
    // Set the stage parameters from the dimensions object
	my.stage.canvas.width = Math.floor(this.bounds.absolute.width);
	console.log("Inital width: "+this.stage.canvas.width+"px");
});

var renderSystem = function(ecs) {
	var my = {};

	var initialiseEvents = function() {
		// Register start event to start method
	};

	var render = function() {
		ecs.runSystem(
			[componentTypeEnum.ABSOLUTE_BOUNDS, componentTypeEnum.VIEW],
			null,
			"render");
	};

	var start = function() {
	    // Create the easel stage
	    my.stage = new createjs.Stage('notebooknumbers');

	    // More stage set up
	    // Enable touch screen support
		if (createjs.Touch.isSupported()) {
			console.log("Touch enabled version");
			createjs.Touch.enable(my.stage);
		} else {
			console.log("Non-touch enabled version");
			my.stage.enableMouseOver();
		}
		// TODO: Start calling render
	};

	my.start = start;
	return my;
};

var boundsSystem = function(ecs) {

	var my = {};

	var initialiseEvents = function() {
		// Register start event to start method
	};

	var tick = function() {
		var fullWidth = $("#canvas-holder").width();
		var fullHeight = $("#canvas-holder").height();
		var maxAbsoluteBounds = {
			x: 0,
			y: 0,
			width: fullWidth,
			height: fullHeight
		};

		ecs.runSystem(
			[componentTypeEnum.BOUNDS],
			function(entity, components) {
				var bounds = components[componentTypeEnum.BOUNDS];
				var parentBounds = entity.parent[componentTypeEnum.BOUNDS]; 
				// TODO: Some actually geom
				bounds.absolute.x = parentBounds.absolute.x
				bounds.absolute.y = parentBounds.absolute.x
				bounds.absolute.width = parentBounds.absolute.x
				bounds.absolute.height = parentBounds.absolute.x
			})
	}

	var start = function() {
	};


};

var backgroundEntityComponents = [backgroundViewComponent()];
var backgroundEntity = entity(backgroundEntityComponents)
var ecs = entityComponentSystem();
ecs.entities.push(backgroundEntity);

var rs = renderSystem(ecs);
rs.start();

}