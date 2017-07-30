var assert = chai.assert;

var childEntity1 = entity("testChild1", [scoreComponent()]);

var getSimpleEcs = function() {
    var ecs = entityComponentSystem();
    ecs.addEntity(null, entity("test"));
    ecs.addEntities("test", [childEntity1, entity("testChild2")]);
    return ecs;
}

describe("ecs", function() {
  it("should be instantiated", function() {
    var ecs = entityComponentSystem();
  });

  it("should add entities", function() {
    var ecs = getSimpleEcs();
    var count = 0;
    ecs.runSystem([], function(entity) {
        count++;
    })
    assert.equal(count, 3);
  });

  it("should add run system only when the components specified match", function() {
    var ecs = getSimpleEcs();
    var count = 0;
    ecs.runSystem([componentTypeEnum.SCORE], function(entity) {
        count++;
    })
    assert.equal(count, 1);
  });

  it("should add run system only once", function() {
    var ecs = getSimpleEcs();
    var count = 0;
    ecs.runSystemOnce([], function(entity) {
        count++;
    })
    assert.equal(count, 1);
  });

  it("should remove entities", function() {
    var ecs = getSimpleEcs();
    ecs.removeEntities("testChild1");
    var count = 0;
    ecs.runSystem([], function(entity) {
        count++;
    })
    assert.equal(count, 2);
  });

  it("should remove entities by id", function() {
    var ecs = getSimpleEcs();
    ecs.removeEntitiesById([childEntity1]);
    var count = 0;
    ecs.runSystem([], function(entity) {
        count++;
    })
    assert.equal(count, 2);
  });
});