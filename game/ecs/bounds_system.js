var boundsSystem = function(ecs, eventManager) {
	var my = {};

	var update = function() {
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

	var resizeHelper = function(entityParent, newBounds, oldBounds) {
		if (newBounds.relative.height <= newBounds.originalRelative.height)
			return;

		var bounds = entityParent.components[componentTypeEnum.BOUNDS];

		var heightDifferential = newBounds.relative.height - oldBounds.relative.height;
		bounds.relative.height += heightDifferential;

		entityParent = entityParent.parent;
		if (entityParent)
			resizeHelper(entityParent, newBounds, oldBounds);
	};

	// Sometimes the game will make the bounds larger and we need to propagate
	// this effect across the bounds graph
	// Firstly, we resize the target element to be relatively larger as specified
	// Then, we traverse upwards through each parent and add the new height differential
	var resize = function(newBounds) {
		ecs.runSystem(
			[componentTypeEnum.BOUNDS],
			function(entity) {
				var bounds = entity.components[componentTypeEnum.BOUNDS];
				var isTarget = bounds.id === newBounds.id;
				if (isTarget) {
					var parentEntity = entity.parent;
					resizeHelper(parentEntity, newBounds, bounds);
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
