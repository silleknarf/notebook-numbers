var scrollSystem = function(eventManager) {

	var init = function() {

	};

	var initialiseEvents = function() {
		eventManager.vent.on("SYSTEM:SCROLL:START", init);
	}
	initialiseEvents();
};