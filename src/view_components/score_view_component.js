var scoreViewComponent = function() {
    var my = {};

    var getFont = function(absolute) {
        var fontSize = Math.floor(absolute.height);
        var font = fontSize + "px " + config.titleFont;
        return font;
    };
    
    var init = function(renderSystem, entity, eventManager) {

        var view = entity.components[componentTypeEnum.BOUNDS];
        var absolute = view.absolute;

        var scoreComponent = entity.components[componentTypeEnum.SCORE];
        var score = new createjs.Text("Score: " + scoreComponent.score);
        score.font = getFont(absolute);
        score.color = config.titleColour;
        renderSystem.stage.addChild(score);

        my.score = score;
    };

    var render = function(renderSystem, entity, eventManager) {
        var bounds = entity.components[componentTypeEnum.BOUNDS];

        my.score.text = "Score: " + entity.components[componentTypeEnum.SCORE].score.toLocaleString();
        my.score.visible = entity.components[componentTypeEnum.SCORE].isVisible;

        var font = getFont(bounds.absolute);
        var middle = Math.floor(bounds.absolute.width/2 - my.score.getMeasuredWidth()/2);
        my.score.x = bounds.absolute.x + middle;
        my.score.y = bounds.absolute.y; 
        my.score.font = font;
    }

    var remove = function(renderSystem) {
        renderSystem.stage.removeChild(my.score);
    };

    return viewComponent(init, render, remove);
};