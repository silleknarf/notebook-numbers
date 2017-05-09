var boundsSystem = function(ecs, eventManager) {
	var my = {};

	my.background = {
		relative: {
			height: 100
		}
	}

	// We get the max size of the canvas but if we have scaled
	// it up to be larger than the screen then we re-scale it
	// to be the max size of the canvas
	var getMaxAbsoluteBounds = function() {
		
		var fullWidth = $("#canvas").width();
		var fullHeight = $("#canvas").height();

		var maxAbsoluteBounds = { 
			absolute: {
				x: 0,
				y: 0,
				width: fullWidth,
				height: fullHeight 
			}
		};

		//console.log("Width: " + fullWidth + ", Height: " + fullHeight);
		return maxAbsoluteBounds;
	};

	var update = function() {
		ecs.runSystem(
			[componentTypeEnum.BOUNDS],
			function(entity) {
				var bounds = entity.components[componentTypeEnum.BOUNDS];
				var maxAbsoluteBounds = getMaxAbsoluteBounds();
				var parentBounds = entity.parent 
					? entity.parent.components[componentTypeEnum.BOUNDS]
					: maxAbsoluteBounds;

				// The background has got it's own separate height variable
				// we give it special treatment due to it's absolute placement
				var maxAbsoluteHeight = Math.floor(maxAbsoluteBounds.absolute.height * (my.background.relative.height / 100));
				my.background.absolute = { height: maxAbsoluteHeight };
				bounds.background = my.background;

				bounds.absolute.width = Math.floor((bounds.relative.width / 100) * parentBounds.absolute.width);
				bounds.absolute.height = Math.floor((bounds.relative.height / 100) * parentBounds.absolute.height);
				bounds.absolute.x = Math.floor((bounds.relative.x / 100) * parentBounds.absolute.width + parentBounds.absolute.x);
				bounds.absolute.y = Math.floor((bounds.relative.y / 100) * parentBounds.absolute.height + parentBounds.absolute.y);			

				// Work out if we have any additional height which we may
				// need to notify the scrolling system about
				my.previousHeightBeyoundBounds = my.heightBeyondBounds;
				my.heightBeyondBounds = my.background.absolute.height - maxAbsoluteBounds.absolute.height;
				if (my.previousHeightBeyoundBounds !== my.heightBeyondBounds)
					eventManager.vent.trigger("SYSTEM:SCROLL:HEIGHT_BEYOND_BOUNDS", my.heightBeyondBounds);
			})
	}

	var move = function(targetName, newX, newY) {
		ecs.runSystem(
			[componentTypeEnum.BOUNDS],
			function(entity) {
				if (entity.name === targetName) {
					var bounds = entity.components[componentTypeEnum.BOUNDS];
					if (newX)
						bounds.relative.x = newX;
					if (newY)
						bounds.relative.y = newY;
				}
			});
	}

	var updateMaxHeight = function(height) {
		if (height > 100)
			my.background.relative.height = height;
	}

	var start = function() {
		$(document).ready(function() {
			update();
			$( window ).resize(function() { 
				setTimeout(update, 50);
			});
			eventManager.vent.on("SYSTEM:BOUNDS:UPDATE", update);
		});
	};

	var initialiseEvents = function() {
		eventManager.vent.on("SYSTEM:BOUNDS:START", start);
		eventManager.vent.on("SYSTEM:BOUNDS:MOVE", move);
		eventManager.vent.on("SYSTEM:BOUNDS:UPDATE_MAX_HEIGHT", updateMaxHeight);
	};
	initialiseEvents();
};
