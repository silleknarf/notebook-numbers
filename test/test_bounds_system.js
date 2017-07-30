var assert = chai.assert;

var setupBoundsSystem = function() {
    var testEntity = entity("test", [boundsComponent({x: 25, y: 75, width: 50, height: 50})])
    var mockEcs = {
        runSystem: function(components, sysFunc) {
            sysFunc(testEntity);
        }
    };
    $ = function(str) {
        return {
            width: function() {
                return 1000;
            },
            height: function() {
               return 2000; 
            },
            resize: function() { }
        };
    };
    config = { gizmoSystemEnabled: false };
    boundsSystem(mockEcs, eventManager);
    eventManager.vent.trigger("SYSTEM:BOUNDS:START");
    return testEntity;
};

describe("bounds system", function() {
    it("should set the size of view components", function() {
        var testEntity = setupBoundsSystem();
        eventManager.vent.trigger("SYSTEM:BOUNDS:UPDATE");
        var testEntityAbsoluteBounds = testEntity.components[componentTypeEnum.BOUNDS].absolute;
        assert.equal(testEntityAbsoluteBounds.x, 250);
        assert.equal(testEntityAbsoluteBounds.y, 1500);
        assert.equal(testEntityAbsoluteBounds.width, 500);
        assert.equal(testEntityAbsoluteBounds.height, 1000);
    });
    it("should move components", function() {
        var testEntity = setupBoundsSystem();
        eventManager.vent.trigger("SYSTEM:BOUNDS:MOVE", "test", 1, 2);
        var testEntityRelativeBounds = testEntity.components[componentTypeEnum.BOUNDS].relative;
        assert.equal(testEntityRelativeBounds.x, 1);
        assert.equal(testEntityRelativeBounds.y, 2);
    });
    it("should update max grid height", function() {
        setupBoundsSystem();
        var testHeightBeyondBounds = null;
        eventManager.vent.on("SYSTEM:SCROLL:HEIGHT_BEYOND_BOUNDS", function(heightBeyondBounds) {
            testHeightBeyondBounds = heightBeyondBounds;
        });
        eventManager.vent.trigger("SYSTEM:BOUNDS:UPDATE_MAX_HEIGHT", 4000, 100);
        eventManager.vent.trigger("SYSTEM:BOUNDS:UPDATE");
        assert.equal(testHeightBeyondBounds, 78000);
    });
});