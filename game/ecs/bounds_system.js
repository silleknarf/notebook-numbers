var boundsSystem = function(ecs, eventManager) {
	var my = {};

	var update = function() {
		var fullWidth = $("#canvas-holder").width();
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
		console.log("Width: " + fullWidth + ", Height: " + fullHeight);

		ecs.runSystem(
			[componentTypeEnum.BOUNDS],
			function(entity) {
				var bounds = entity.components[componentTypeEnum.BOUNDS];
				var parentBounds = entity.parent 
					? entity.parent.components[componentTypeEnum.BOUNDS]
					: maxAbsoluteBounds;

				bounds.absolute.width = (bounds.relative.width / 100) * parentBounds.absolute.width;
				bounds.absolute.height = (bounds.relative.height / 100) * parentBounds.absolute.height;
				bounds.absolute.x = (bounds.relative.x / 100) * parentBounds.absolute.width + parentBounds.absolute.x;
				bounds.absolute.y = (bounds.relative.y / 100) * parentBounds.absolute.height + parentBounds.absolute.y;			
			})
	}

	var start = function() {
		update();
		$( window ).resize(function() { 
			setTimeout(update, 50);
		});
	};

	var initialiseEvents = function() {
		eventManager.vent.on("SYSTEM:BOUNDS:START", start);
		eventManager.vent.on("SYSTEM:BOUNDS:UPDATE", update);
	};
	initialiseEvents();
};
