var leaderboardSystem = function(eventManager) {
    var my = {};
    my.actions = Object.freeze({
        LOGIN: "Log In",
        LEADERBOARDS: "Leaderboards"
    });
    my.currentAction = my.actions.LOGIN;

    var maybeRunSwiftEvent = function(event, params) {
        if (window.webkit && window.webkit.messageHandlers) {
            var event = { event: event, params: params };
            window.webkit.messageHandlers.swift.postMessage(event);
        }
    };

    var login = function() {
        console.log("Log in");
        if (window.AppInterface) {
            window.AppInterface.logIn();
        } 
        maybeRunSwiftEvent("SYSTEM:SWIFT:LOG_IN");
    }

    var openLeaderboards = function() {
        console.log("Open leaderboards");
        if (window.AppInterface && window.AppInterface.isSignedIn()) {
            window.AppInterface.openLeaderboards();
        } 
        maybeRunSwiftEvent("SYSTEM:SWIFT:OPEN_LEADERBOARDS");
    }

    var action = function() {
        if (my.currentAction === my.actions.LOGIN)
            login();
        else if (my.currentAction === my.actions.LEADERBOARDS)
            openLeaderboards();

        eventManager.vent.trigger("SYSTEM:BOUNDS:UPDATE");
    }

    var getAction = function() {
        this.text = my.currentAction;
    }

    var loggedIn = function() {
        my.currentAction = my.actions.LEADERBOARDS;
        eventManager.vent.trigger("SYSTEM:BOUNDS:UPDATE");
    }

    var loggedOut = function() { 
        my.currentAction = my.actions.LOGIN;
        eventManager.vent.trigger("SYSTEM:BOUNDS:UPDATE");
    }

    var updateLeaderboards = function() {
        var isTutorialMode = eventManager.vent.trigger("SYSTEM:MODE:GET").mode === "tutorial";
        if (isTutorialMode)
            return;
        
        var score = eventManager.vent.trigger("SYSTEM:SCORE:GET").score;
        if (window.AppInterface && window.AppInterface.isSignedIn()) {
            window.AppInterface.updateLeaderboards(score);
        } 
        maybeRunSwiftEvent("SYSTEM:SWIFT:UPDATE_LEADERBOARD", score);
    }

    var setupLoginState = function() {
        if (window.AppInterface) {
            if (window.AppInterface.isSignedIn()) {
                my.currentAction = my.actions.LEADERBOARDS;
            } else {
                my.currentAction = my.actions.LOGIN;
            }
            console.log("Setup with current action: " + my.currentAction);
        }
        maybeRunSwiftEvent("SYSTEM:SWIFT:CHECK_LOGIN");
    }
    setupLoginState();

    var initialiseEvents = function() {
        eventManager.vent.on("SYSTEM:LEADERBOARDS:ACTION", action);
        eventManager.vent.on("SYSTEM:LEADERBOARDS:GET_ACTION", getAction);
        eventManager.vent.on("SYSTEM:LEADERBOARDS:LOGGED_IN", loggedIn);
        eventManager.vent.on("SYSTEM:LEADERBOARDS:LOGGED_OUT", loggedOut);
        eventManager.vent.on("SYSTEM:LOGIC:GRID_COMPLETED", updateLeaderboards);
    };
    initialiseEvents();
};