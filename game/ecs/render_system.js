var renderSystem = function(ecs, eventManager, preloader) {
	var my = {};

	var render = function() {
		ecs.runSystem(
			[componentTypeEnum.BOUNDS, componentTypeEnum.VIEW],
			function(entity) { 
				var view = entity.components[componentTypeEnum.VIEW];
				view.render(my, entity, eventManager);
			});
		my.stage.update();
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

		// preload assets
		preloader(my);
		my.loadImages(function() {
			ecs.runSystem(
				[componentTypeEnum.BOUNDS, componentTypeEnum.VIEW],
				function(entity) { 
					var view = entity.components[componentTypeEnum.VIEW];
					if (view.init)
						view.init(my, entity);
				});

		    createjs.Ticker.setFPS(25);
		    createjs.Ticker.on("tick", render);
		});
	};

	var initialiseEvents = function() {
		eventManager.vent.on("SYSTEM:RENDER:START", start);
	};
	initialiseEvents();
};