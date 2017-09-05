var timerSystem = function(eventManager) {
    var my = {};
    my.lastSecondPassed = 0;
    my.startTime = null;
    my.duration = null;
    my.timeInSecondsRemaining = null;
    my.time = 0;

    var handleTick = function(event) {
        my.time = event.time;

        // Actions carried out each tick (aka frame)
        if (event.paused || my.startTime === null)
            return;

        var timeElapsed = event.time - my.lastSecondPassed;
        var oneSecond = 1000;
        if (timeElapsed >= oneSecond) {
            my.lastSecondPassed = event.time;

            // Countdown to the event
            if (my.duration !== null) {
                var timeInSeconds = Math.floor((event.time - my.startTime) / oneSecond);
                my.timeInSecondsRemaining = my.duration - timeInSeconds;
                // The event is happening now!
                if (my.timeInSecondsRemaining <= 0) {
                    // Execute the event code
                    eventManager.vent.trigger(my.event);
                    my.duration = null;
                    my.timeInSecondsRemaining = null;
                }
                save();

                eventManager.vent.trigger("SYSTEM:BOUNDS:UPDATE");
            }
        }
    };

    var set = function(duration, event) {
        my.lastSecondPassed = my.time;
        my.startTime = my.time;
        my.duration = duration;
        my.timeInSecondsRemaining = duration;
        my.event = event;
        eventManager.vent.trigger("SYSTEM:BOUNDS:UPDATE");
    }

    var getRemaining = function() {
        this.remaining = my.timeInSecondsRemaining;
    }

    var reset = function() {
        my.duration = null;
        my.timeInSecondsRemaining = null;
        save();
        eventManager.vent.trigger("SYSTEM:BOUNDS:UPDATE");
    }

    var save = function() {
        localStorage.setItem("timeInSecondsRemaining", my.timeInSecondsRemaining);
        localStorage.setItem("event", my.event);
    };

    var load = function() {
        var timeInSecondsRemaining = localStorage.getItem("timeInSecondsRemaining");
        if (timeInSecondsRemaining !== null && !isNaN(timeInSecondsRemaining)) {
            var event = localStorage.getItem("event");
            set(timeInSecondsRemaining, event);
        }
    }

    var initialiseEvents = function() {
        eventManager.vent.on("SYSTEM:TIMER:SET", set);
        eventManager.vent.on("SYSTEM:TIMER:GET_REMAINING", getRemaining);
        eventManager.vent.on("SYSTEM:TIMER:RESET", reset);
        eventManager.vent.on("SYSTEM:TIMER:LOAD", load);
        eventManager.vent.on("SYSTEM:LOGIC:GRID_COMPLETED", reset);
    };
    initialiseEvents();

    createjs.Ticker.addEventListener("tick", handleTick);
}