var scoreSystem = function(ecs, eventManager) {
	var my = {};

    my.score = 0;

    var add = function(score) {
        my.score += score;
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
            });
    }

	var initialiseEvents = function() {
        eventManager.vent.on("SYSTEM:SCORE:ADD", add);
        eventManager.vent.on("SYSTEM:SCORE:RESET", reset);
	};
	initialiseEvents();
};