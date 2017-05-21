var scrollSystem = function(eventManager) {
	var my = {};

	my.maxScrollPosition = 0;
	my.scrollDistance = 20;
	my.startDragY = null;

	var moveUp = function(scrollDistance) {
		my.stage.regY -= scrollDistance;	

		if (my.stage.regY < 0)  {
			my.stage.regY = 0;
		}
		console.log("up");
	};

	var moveDown = function(scrollDistance) { 
		my.stage.regY += scrollDistance;	

		if (my.stage.regY > my.maxScrollPosition) {
			my.stage.regY = my.maxScrollPosition;
		}

		console.log("down");
	};

	var startDrag = function(event) {
	    if (event.stageY >= my.startDragY)
	    	moveUp(my.scrollDistance);
	    else
	    	moveDown(my.scrollDistance);

	    my.startDragY = event.stageY

		eventManager.vent.trigger("SYSTEM:RENDER:RENDER");
		/*
		console.log("Drag event")
		if (my.startDragY === null) {
	    	my.startDragY = event.stageY;
	    	console.log("Scroll initiated: " + my.startDragY);
	    	return;
		}

		var scrollDistance = Math.abs(event.stageY - my.startDragY);
		console.log("Scolling: " + scrollDistance)
		if (scrollDistance >= 20) {
		    if (event.stageY >= my.startDragY)
		    	moveUp(scrollDistance);
		    else
		    	moveDown(scrollDistance);
		
		    my.startDragY = event.stageY;
		  	eventManager.vent.trigger("SYSTEM:RENDER:RENDER");
		}*/
	}

	var doDrag = function(event) {
	    //my.startDragY = null;
	    console.log("Stopped dragging");
	}

	var init = function(stage) {
		my.stage = stage;
		my.stage.regY = 0;
		key('up', function() { 
			moveUp(my.scrollDistance);
	        eventManager.vent.trigger("SYSTEM:RENDER:RENDER");
		});
		key('down', function() {
			moveDown(my.scrollDistance);
	        eventManager.vent.trigger("SYSTEM:RENDER:RENDER");
		});

		my.stage.addEventListener("pressmove", startDrag); 
	    my.stage.addEventListener("pressup", doDrag);
	    //my.stage.addEventListener("click", doDrag);
	};

	$(document).ready(function(){
	    $('#canvas').bind('mousewheel', function(e){
	        if(e.originalEvent.wheelDelta /120 > 0) {
	            moveUp(my.scrollDistance);
	        }
	        else{
	            moveDown(my.scrollDistance);
	        }
	        eventManager.vent.trigger("SYSTEM:RENDER:RENDER");
	    });
	});

	var updateHeightBeyondBounds = function(heightBeyondBounds) {
		if (heightBeyondBounds > 0) {
			my.maxScrollPosition = heightBeyondBounds;
			my.stage.regY = Math.min(my.stage.regY, heightBeyondBounds);
		} else {
			my.stage.regY = 0;
		}
	};


	var initialiseEvents = function() {
		eventManager.vent.on("SYSTEM:SCROLL:START", init);
		eventManager.vent.on("SYSTEM:SCROLL:HEIGHT_BEYOND_BOUNDS", updateHeightBeyondBounds);
	}
	initialiseEvents();
};