//var chai = require('chai');
//var rewire = require('rewire');
//var ecs = rewire('../ecs/ecs.js');
var assert = chai.assert;

describe('ecs', function() {
  it('should be instantiated', function() {
    var ecs = entityComponentSystem();
  });

  it('should add entities', function() {
    var ecs = entityComponentSystem();
    ecs.addEntity(null, entity("test"));
    ecs.addEntities("test", [entity("testChild1"), entity("testChild2")]);
    var count = 0;
    ecs.runSystem([], function(entity) {
        count++;
    })
    assert.equal(count, 3);
  });
});