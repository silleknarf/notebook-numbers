var leaderboardSystem = function(eventManager) {
    var my = {};
    my.isLoggedIn = false;

    var maybeRunSwiftEvent = function(event, params) {
        if (window.webkit && window.webkit.messageHandlers) {
            var event = { event: event, params: params };
            window.webkit.messageHandlers.swift.postMessage(event);
        }
    };

    var logIn = function() {
        console.log("Log in");
        if (window.AppInterface) {
            window.AppInterface.logIn();
        } 
    }

    var openLeaderboards = function() {
        console.log("Open leaderboards");
        if (window.AppInterface && window.AppInterface.isSignedIn()) {
            window.AppInterface.openLeaderboards();
        } 
        maybeRunSwiftEvent("SYSTEM:SWIFT:OPEN_LEADERBOARDS");
    }

    var updateLeaderboards = function() {
        var isTutorialMode = eventManager.vent.trigger("SYSTEM:MODE:GET").mode === "tutorial";
        if (isTutorialMode || !my.isLoggedIn)
            return;

        var score = eventManager.vent.trigger("SYSTEM:SCORE:GET").score;
        if (window.AppInterface && window.AppInterface.isSignedIn()) {
            window.AppInterface.updateLeaderboards(score);
        } 
        maybeRunSwiftEvent("SYSTEM:SWIFT:UPDATE_LEADERBOARDS", score);
    }

    var loggedIn = function() {
        my.isLoggedIn = true;
        eventManager.vent.trigger("SYSTEM:BOUNDS:UPDATE");
    }

    var loggedOut = function() { 
        my.isLoggedIn = false;
        eventManager.vent.trigger("SYSTEM:BOUNDS:UPDATE");
    }

    var setupLoginState = function() {
        if (window.AppInterface) {
            if (window.AppInterface.isSignedIn()) {
                my.isLoggedIn = true;
            } else {
                my.isLoggedIn = false;
            }
        }
        maybeRunSwiftEvent("SYSTEM:SWIFT:CHECK_LOGIN");
        console.log("Log in state set to: " + my.isLoggedIn);
    }
    setupLoginState();

    var getIsLoggedIn = function() {
        this.isLoggedIn = my.isLoggedIn;
    }

    var initialiseEvents = function() {
        eventManager.vent.on("SYSTEM:LEADERBOARDS:OPEN_LEADERBOARDS", openLeaderboards);
        eventManager.vent.on("SYSTEM:LEADERBOARDS:LOG_IN", logIn);
        eventManager.vent.on("SYSTEM:LEADERBOARDS:GET_IS_LOGGED_IN", getIsLoggedIn);
        eventManager.vent.on("SYSTEM:LEADERBOARDS:LOGGED_IN", loggedIn);
        eventManager.vent.on("SYSTEM:LEADERBOARDS:LOGGED_OUT", loggedOut);
        eventManager.vent.on("SYSTEM:LOGIC:GRID_COMPLETED", updateLeaderboards);
    };
    initialiseEvents();
};