var leaderboardSystem = function(eventManager) {
    var my = {};
    my.actions = Object.freeze({
        LOGIN: "Log In",
        LEADERBOARDS: "Leaderboards"
    });
    my.currentAction = my.actions.LOGIN;

    var login = function() {
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
    }

    var setupLoginState = function() {
        if (window.AppInterface && window.AppInterface.isSignedIn) {
            if (window.AppInterface.isSignedIn()) {
                my.currentAction = my.actions.LEADERBOARDS;
            } else {
                my.currentAction = my.actions.LOGIN;
            }
        }
        console.log("Setup with current action: " + my.currentAction);
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