var scoreSystem = function(ecs, eventManager) {
    var my = {};

    var add = function(score) {
        my.score += score;
        update();
    };

    var completedGame = function() {
        var level = +eventManager.vent.trigger("SYSTEM:LEVEL:GET_CURRENT_NUMBER").number;
        my.score = level * 1000000 - my.score;
        update();
    };

    var reset = function() {
        my.score = 0;
        update();
    };

    var show = function() {
        my.isScoreVisible = true;
        update();
    }

    var hide = function() {
        my.isScoreVisible = false;
        update();
    }

    var getScore = function() {
        this.score = my.score;
    }

    var saveScore = function() {
        if (typeof my.score != "undefined")
            localStorage.setItem('score', JSON.stringify(my.score));
    }

    var loadScore = function() {
        var score = localStorage.getItem('score');
        if (score && score !== "undefined")
            my.score = JSON.parse(score);
        else 
            my.score = 0;
        update();
    }

    var update = function() {
        ecs.runSystem(
            [componentTypeEnum.SCORE],
            function(entity) {
                entity.components[componentTypeEnum.SCORE].score = my.score || 0;
                entity.components[componentTypeEnum.SCORE].isVisible = my.isScoreVisible;
            });
        saveScore();
        eventManager.vent.trigger("SYSTEM:BOUNDS:UPDATE");
    }

    var initialiseEvents = function() {
        eventManager.vent.on("SYSTEM:SCORE:ADD", add);
        eventManager.vent.on("SYSTEM:LOGIC:GRID_COMPLETED", completedGame);
        eventManager.vent.on("SYSTEM:SCORE:RESET", reset);
        eventManager.vent.on("SYSTEM:SCORE:SHOW", show);
        eventManager.vent.on("SYSTEM:SCORE:HIDE", hide);
        eventManager.vent.on("SYSTEM:SCORE:LOAD", loadScore);
        eventManager.vent.on("SYSTEM:SCORE:GET", getScore);
    };
    initialiseEvents();
};