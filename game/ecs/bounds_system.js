var boundsSystem = function(ecs, eventManager) {
	var my = {};

	// We get the max size of the canvas but if we have scaled
	// it up to be larger than the screen then we re-scale it
	// to be the max size of the canvas
	var getMaxAbsoluteBounds = function(relativeBounds) {
		var fullWidth = $("#canvas").width();
		var fullHeight = $("#canvas").height();

		var maxAbsoluteBounds = { 
			absolute: {
				x: 0,
				y: 0,
				width: fullWidth / relativeBounds.width * 100,
				height: fullHeight / relativeBounds.height * 100
			}
		};

		console.log("Width: " + fullWidth + ", Height: " + fullHeight);
		return maxAbsoluteBounds;
	};

	var update = function() {
		ecs.runSystem(
			[componentTypeEnum.BOUNDS],
			function(entity) {
				var bounds = entity.components[componentTypeEnum.BOUNDS];
				var parentBounds = entity.parent 
					? entity.parent.components[componentTypeEnum.BOUNDS]
					: getMaxAbsoluteBounds(bounds.relative);

				var originalScalingFactor = bounds.relative.height / bounds.originalRelative.height;
				bounds.absolute.width = Math.floor((bounds.relative.width / 100) * parentBounds.absolute.width);
				bounds.absolute.height = Math.floor((bounds.relative.height / 100) * parentBounds.absolute.height);
				bounds.absolute.x = Math.floor((bounds.relative.x / 100) * parentBounds.absolute.width + parentBounds.absolute.x);
				bounds.absolute.y = Math.floor((bounds.relative.y / 100) * parentBounds.absolute.height / originalScalingFactor + parentBounds.absolute.y);			
			})
	}

	var resizeTopLevelParent = function(entityParent, newBounds, oldBounds) {
		var bounds = entityParent.components[componentTypeEnum.BOUNDS];

		var heightDifferential = newBounds.relative.height - oldBounds.relative.height;
		
		// We never let the relative height be smaller than it's original size
		if (bounds.relative.height < bounds.originalRelative.height)
			heightDifferential = 0;

		var originalRelativeHeight = bounds.relative.height;
		bounds.relative.height += heightDifferential;
	};

	var getTopLevelParent = function(entity) {
		if (entity.parent)
			return getTopLevelParent(entity.parent);
		return entity;
	}

	// Sometimes the game will make the bounds larger and we need to propagate
	// this effect across the bounds graph
	// Firstly, we resize the target element to be relatively larger as specified
	// Then, we traverse upwards through each parent and a add the new height differential
	// to the outermost element
	var resize = function(newBounds) {
		update();
		ecs.runSystem(
			[componentTypeEnum.BOUNDS],
			function(entity) {
				var bounds = entity.components[componentTypeEnum.BOUNDS];
				var isTarget = bounds.id === newBounds.id;
				if (isTarget) {
					var parentEntity = getTopLevelParent(entity);
					resizeTopLevelParent(parentEntity, newBounds, bounds);
					bounds.relative.height = newBounds.relative.height;
				}
			})
	};

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
		eventManager.vent.on("SYSTEM:BOUNDS:RESIZE", resize);
		eventManager.vent.on("SYSTEM:BOUNDS:MOVE", move);
	};
	initialiseEvents();
};
