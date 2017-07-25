var scoreSystem = function(ecs, eventManager) {
	var my = {};

    my.score = 0;
    my.isScoreVisible = false;

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

    var update = function() {
        ecs.runSystem(
            [componentTypeEnum.SCORE],
            function(entity) {
                entity.components[componentTypeEnum.SCORE].score = my.score;
                entity.components[componentTypeEnum.SCORE].isVisible = my.isScoreVisible;
            });
    }

    var show = function() {
        my.isScoreVisible = true;
        update();
    }

    var hide = function() {
        my.isScoreVisible = false;
        update();
    }

	var initialiseEvents = function() {
        eventManager.vent.on("SYSTEM:SCORE:ADD", add);
        eventManager.vent.on("SYSTEM:SCORE:COMPLETED_GAME", completedGame);
        eventManager.vent.on("SYSTEM:SCORE:RESET", reset);
        eventManager.vent.on("SYSTEM:SCORE:SHOW", show);
        eventManager.vent.on("SYSTEM:SCORE:HIDE", hide);
	};
	initialiseEvents();
};