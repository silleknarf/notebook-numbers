var scoreSystem = function(ecs, eventManager) {
	var my = {};

    var add = function(score) {
        my.score += score;
        update();
    };

    var completedGame = function() {
        my.score = 1000060 - my.score;
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
    }

	var initialiseEvents = function() {
        eventManager.vent.on("SYSTEM:SCORE:ADD", add);
        eventManager.vent.on("SYSTEM:SCORE:COMPLETED_GAME", completedGame);
        eventManager.vent.on("SYSTEM:SCORE:RESET", reset);
        eventManager.vent.on("SYSTEM:SCORE:SHOW", show);
        eventManager.vent.on("SYSTEM:SCORE:HIDE", hide);
        eventManager.vent.on("SYSTEM:SCORE:LOAD", loadScore);
	};
	initialiseEvents();
};