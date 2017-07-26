var gizmoSystem = function(ecs, eventManager) {
    var my = {};

    var init = function(renderSystem, entity) { 
        var viewId = entity.components[componentTypeEnum.VIEW].id;
        my.renderSystem = renderSystem;
        update(entity);
        console.log("Gizmo drawn for entity: " + entity.name + " with id: " + viewId);
    };

    var update = function(entity) {
        var view = entity.components[componentTypeEnum.VIEW];
        var bounds = entity.components[componentTypeEnum.BOUNDS];

        if (!bounds || !view || !my.renderSystem)
            return;

        if (view.gizmo)
            my.renderSystem.stage.removeChild(view.gizmo);

        var outline = new createjs.Graphics();
        outline.setStrokeStyle(1);
        outline.beginStroke("black");
        outline.moveTo(bounds.absolute.x, bounds.absolute.y);
        outline.lineTo(bounds.absolute.x+bounds.absolute.width, bounds.absolute.y);
        outline.lineTo(bounds.absolute.x+bounds.absolute.width, bounds.absolute.y+bounds.absolute.height);
        outline.lineTo(bounds.absolute.x, bounds.absolute.y+bounds.absolute.height);
        outline.lineTo(bounds.absolute.x, bounds.absolute.y);
        var outlineShape = new createjs.Shape(outline);
        view.gizmo = outlineShape;
        my.renderSystem.stage.addChild(outlineShape);
        my.renderSystem.stage.setChildIndex(outlineShape, my.renderSystem.stage.getNumChildren()-1);    
    }

    // TODO - cleanup graphics 

    var initialiseEvents = function() {
        eventManager.vent.on("SYSTEM:GIZMO:INIT", init);
        eventManager.vent.on("SYSTEM:GIZMO:UPDATE", update);
    }
    initialiseEvents();
};