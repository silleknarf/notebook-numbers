var gridEntityFactory = function(gridComponent) {
    var relativeBounds = {
        x: 5,
        y: 5,
        width: 50,
        height: 100
    };
    var gridBoundsComponent = boundsComponent(relativeBounds);

    var gridComponents = [gridComponent, gridBoundsComponent];

    return entity("grid", gridComponents);
};