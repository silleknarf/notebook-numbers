var renderSystem = function(ecs, eventManager, preloader) {
	var my = {};

	var render = function() {
		ecs.runSystem(
<<<<<<< HEAD
			[componentTypeEnum.BOUNDS, componentTypeEnum.VIEW],
			function(entity) { 
				var view = entity.components[componentTypeEnum.VIEW];
				view.render(my, entity, eventManager);
=======
			[componentTypeEnum.ABSOLUTE_BOUNDS, componentTypeEnum.VIEW],
			function(entity) { 
				var view = entity.components[componentTypeEnum.VIEW];
				view.render(entity);
>>>>>>> fe8d1f25a422bf780a9a5e28c7513ef65933b0fa
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
<<<<<<< HEAD
				[componentTypeEnum.BOUNDS, componentTypeEnum.VIEW],
				function(entity) { 
					var view = entity.components[componentTypeEnum.VIEW];
					view.init(my, entity);
=======
				[componentTypeEnum.ABSOLUTE_BOUNDS, componentTypeEnum.VIEW],
				function(entity) { 
					var view = entity.components[componentTypeEnum.VIEW];
					view.init(entity);
>>>>>>> fe8d1f25a422bf780a9a5e28c7513ef65933b0fa
				});

		    createjs.Ticker.setFPS(25);
		    createjs.Ticker.on("tick", render);
		});
	};

	var initialiseEvents = function() {
<<<<<<< HEAD
		eventManager.vent.on("SYSTEM:RENDER:START", start);
	};
	initialiseEvents();
=======
		eventManager.vent.on("SYSTEM:RENDER:START");
	};
>>>>>>> fe8d1f25a422bf780a9a5e28c7513ef65933b0fa
};