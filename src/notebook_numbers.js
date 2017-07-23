
var init = function() {
	var preloadSystem = preloadSystemFactory();
	preloadSystem.load(function() { 

		// Redirect to the relevant app store on mobile
		if (!config.isApprovedVersion)
		{
			if (config.isAndroid && !config.isAndroidNativeApp)
				window.location.href = "market://details?id=com.silleknarf.notebooknumbers";
			else if (config.isIos && !config.isIosNativeApp)
				window.location.href = "http://www.notebooknumbers.com/coming_soon.html"

			return;
		}

		var ecs = entityComponentSystem();

		var cellRepository = cellRepositoryFactory()
		var gridRepository = gridRepositoryFactory(cellRepository);

		gizmoSystem(ecs, eventManager);
		boundsSystem(ecs, eventManager);
		renderSystem(ecs, eventManager, preloadSystem);
		logicSystem(ecs, eventManager, gridRepository);
		cursorSystem(ecs, eventManager, gridRepository, cellRepository);
		cursorViewSystem(ecs, eventManager);
		gridViewSystem(ecs, eventManager);
		scrollSystem(eventManager);
		modeSystem(ecs, eventManager, gridRepository);
		tutorialSystem(ecs, eventManager);

		var backgroundEntity = backgroundEntityFactory();
		ecs.entities.push(backgroundEntity);

		$( document ).ready(function() {

			// Full screen the game on mobile
			if (config.isMobile) {
				$("#header").remove();
				$("#canvas").height("100vh");
			} else {
				$("#header").css("visibility", "visible");
				$(".share-button").css("display", "initial");
			}

			// Hide the loading screen and show the game when we're ready
			$("#loadingscreen").remove();
			$("#notebooknumbers").show();

			eventManager.vent.trigger("SYSTEM:RENDER:START");
			eventManager.vent.trigger("SYSTEM:BOUNDS:START");

			var hasCompletedTutorial = localStorage.getItem('hasCompletedTutorial');
			if (hasCompletedTutorial)
				eventManager.vent.trigger("SYSTEM:MODE:CLASSIC");
			else 
				eventManager.vent.trigger("SYSTEM:MODE:TUTORIAL");
		});
	});
}
