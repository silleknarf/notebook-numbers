var boundsSystem = function(ecs, eventManager) {
	var my = {};

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
			function(entity) {
				var bounds = entity.components[componentTypeEnum.BOUNDS];
				var parentBounds = entity.parent[componentTypeEnum.BOUNDS]; 
				bounds.absolute.width = (bound.relative.width / 100) * parentBounds.absolute.width;
				bounds.absolute.height = (bound.relative.height / 100) * parentBounds.absolute.height;
				bounds.absolute.x = (bounds.relative.x / 100) * bounds.absolute.width + parentBounds.absolute.x;
				bounds.absolute.y = (bounds.relative.y / 100) * bounds.absolute.height + parentBounds.absolute.height;			
			})
	}

	var start = function() {
		$( window ).resize(function() { 
			setTimeout(tick, 50);
		});
	};

	var initialiseEvents = function() {
		eventManager.vent.on("SYSTEM:BOUNDS:START", start);
	};
	initialiseEvents();
};
