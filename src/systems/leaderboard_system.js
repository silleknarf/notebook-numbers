var leaderboardSystem = function(eventManager) {
    var my = {};
    my.actions = Object.freeze({
        LOGIN: "Log In",
        LEADERBOARDS: "Leaderboards"
    });
    my.currentAction = my.actions.LOGIN;

    var login = function() {
        console.log("Login");
        loggedIn();
    }

    var openLeaderboards = function() {
        console.log("Open leaderboards");
        loggedOut();
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
    }

    var loggedOut = function() { 
        my.currentAction = my.actions.LOGIN;
    }

    var initialiseEvents = function() {
        eventManager.vent.on("SYSTEM:LEADERBOARDS:ACTION", action);
        eventManager.vent.on("SYSTEM:LEADERBOARDS:GET_ACTION", getAction);
        eventManager.vent.on("SYSTEM:LEADERBOARDS:LOGGED_IN", loggedIn);
        eventManager.vent.on("SYSTEM:LEADERBOARDS:LOGGED_OUT", loggedOut);
    };
    initialiseEvents();
};