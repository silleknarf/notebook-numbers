var boundsSystem = function(ecs, eventManager) {
	var my = {};

	var tick = function() {
		var fullWidth = $("#canvas-holder").width();
<<<<<<< HEAD
		var fullHeight = window.innerHeight
			|| document.documentElement.clientHeight
			|| document.body.clientHeight;

		// only use 90% of the screen when running in browser
		fullHeight *= 0.9

		var maxAbsoluteBounds = { 
			absolute: {
				x: 0,
				y: 0,
				width: fullWidth,
				height: fullHeight
			}
		};
		console.log("Initial width: " + fullWidth + ", Initial height: " + fullHeight);
=======
		var fullHeight = $("#canvas-holder").height();
		var maxAbsoluteBounds = {
			x: 0,
			y: 0,
			width: fullWidth,
			height: fullHeight
		};
>>>>>>> fe8d1f25a422bf780a9a5e28c7513ef65933b0fa

		ecs.runSystem(
			[componentTypeEnum.BOUNDS],
			function(entity) {
				var bounds = entity.components[componentTypeEnum.BOUNDS];
<<<<<<< HEAD
				var parentBounds = entity.parent 
					? entity.parent[componentTypeEnum.BOUNDS]
					: maxAbsoluteBounds;

				bounds.absolute.width = (bounds.relative.width / 100) * parentBounds.absolute.width;
				bounds.absolute.height = (bounds.relative.height / 100) * parentBounds.absolute.height;
				bounds.absolute.x = (bounds.relative.x / 100) * bounds.absolute.width + parentBounds.absolute.x;
				bounds.absolute.y = (bounds.relative.y / 100) * bounds.absolute.height + parentBounds.absolute.y;			
=======
				var parentBounds = entity.parent[componentTypeEnum.BOUNDS]; 
				bounds.absolute.width = (bound.relative.width / 100) * parentBounds.absolute.width;
				bounds.absolute.height = (bound.relative.height / 100) * parentBounds.absolute.height;
				bounds.absolute.x = (bounds.relative.x / 100) * bounds.absolute.width + parentBounds.absolute.x;
				bounds.absolute.y = (bounds.relative.y / 100) * bounds.absolute.height + parentBounds.absolute.height;			
>>>>>>> fe8d1f25a422bf780a9a5e28c7513ef65933b0fa
			})
	}

	var start = function() {
<<<<<<< HEAD
		tick();
=======
>>>>>>> fe8d1f25a422bf780a9a5e28c7513ef65933b0fa
		$( window ).resize(function() { 
			setTimeout(tick, 50);
		});
	};

	var initialiseEvents = function() {
		eventManager.vent.on("SYSTEM:BOUNDS:START", start);
	};
	initialiseEvents();
};
