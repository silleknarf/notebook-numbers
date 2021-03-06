
var init = function() {
    var preloadSystem = preloadSystemFactory();
    preloadSystem.load(function() { 

        // Redirect to the relevant app store on mobile
        if (!config.isApprovedVersion)
        {
            if (config.isAndroid && !config.isAndroidNativeApp)
                window.location.href = "https://play.google.com/store/apps/details?id=com.silleknarf.notebooknumbers";
            else if (config.isIos && !config.isIosNativeApp)
                window.location.href = "https://itunes.apple.com/app/noteboook-numbers/id1262922571"

            return;
        }

        var ecs = entityComponentSystem();

        var cellUtil = cellUtilFactory()
        var gridUtil = gridUtilFactory(cellUtil);

        gizmoSystem(ecs, eventManager);
        boundsSystem(ecs, eventManager);
        renderSystem(ecs, eventManager, preloadSystem);
        logicSystem(ecs, eventManager, gridUtil);
        cursorSystem(ecs, eventManager, gridUtil, cellUtil);
        cursorViewSystem(ecs, eventManager);
        gridViewSystem(ecs, eventManager);
        scrollSystem(eventManager);
        modeSystem(ecs, eventManager, gridUtil);
        tutorialSystem(ecs, eventManager);
        scoreSystem(ecs, eventManager);
        levelSystem(eventManager);
        leaderboardSystem(eventManager);
        undoSystem(eventManager);
        timerSystem(eventManager);

        var backgroundEntity = backgroundEntityFactory();
        ecs.addEntity(null, backgroundEntity);

        $( document ).ready(function() {

            // Full screen the game on mobile
            if (config.isMobile) {
                $("#overlay").remove();
                $("#canvas").height("100vh");
            } else {
                $("#overlay").css("visibility", "visible");
                $(".share-button").css("display", "initial");
                $(".share-buttons").css("display", "initial");
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
init();
