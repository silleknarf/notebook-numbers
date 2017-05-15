var renderSystem = function(ecs, eventManager, preloader) {
	var my = {};

	my.hasInit = false;
	// When we remove entities they may leave view components hanging around
	// and we need to remove them from the stage
	my.previouslyRenderedEntities = [];

	var removeOldViews = function(previouslyRenderedEntities, renderedEntities) {
		var viewIdsToRemove = _.difference(
			_.keys(previouslyRenderedEntities),
			_.keys(renderedEntities));
		_.forEach(
			viewIdsToRemove,
			function(viewId) {
				var previouslyRenderedEntity = previouslyRenderedEntities[+viewId];
				if (previouslyRenderedEntity.remove) {
					previouslyRenderedEntity.remove(my);
				}
				else if (previouslyRenderedEntity) {
					var parentName = previouslyRenderedEntity.parentEntity.name;
					console.log("Remove method not implemented for entity: " + parentName);
				}
			});
	};

	var render = function() {
		var renderedEntities = {};
		ecs.runSystem(
			[componentTypeEnum.VIEW],
			function(entity) { 
				var view = entity.components[componentTypeEnum.VIEW];
				if (view.init && !view.hasInit)
				{
					view.init(my, entity, eventManager);
					eventManager.vent.trigger("SYSTEM:GIZMO:INIT", my, entity);
					view.hasInit = true;
				}
				view.render(my, entity, eventManager);
				renderedEntities[view.id] = view;
			});

		removeOldViews(my.previouslyRenderedEntities, renderedEntities);
		my.previouslyRenderedEntities = renderedEntities;
		my.stage.update();
	};

	var start = function() {
		if (my.hasInit)
			return;

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

		// preload assets
		preloader(my);
		my.loadImages(function() {
		    createjs.Ticker.setFPS(25);
	    	createjs.Ticker.on("tick", render);
		});

		eventManager.vent.trigger("SYSTEM:SCROLL:START", my.stage);

		my.hasInit = true;
	};

	var initialiseEvents = function() {
		eventManager.vent.on("SYSTEM:RENDER:START", start);
	};
	initialiseEvents();
};