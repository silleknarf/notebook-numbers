var assert = chai.assert;

describe("cell util", function() {
    it("should compare cell equality", function() {
        var cellUtil = cellUtilFactory();
        var cell1 = { i: 0, j: 1 };
        var cell2 = { i: 0, j: 1 };
        var cell3 = { i: 2, j: 1 };
        var areEqual = cellUtil.equals(cell1, cell2);
        var areNotEqual = cellUtil.equals(cell2, cell3);
        assert.isTrue(areEqual);
        assert.isFalse(areNotEqual);
    });
    it("should work out if a cell is before another cell", function() {
        var cellUtil = cellUtilFactory();
        var cell1 = { i: 0, j: 2 };
        var cell2 = { i: 0, j: 3 };
        var cell3 = { i: 1, j: 1 };
        var isBefore = cellUtil.isBefore(cell1, cell2);
        assert.isTrue(isBefore);
        isBefore = cellUtil.isBefore(cell2, cell3);
        assert.isTrue(isBefore);
        var isNotBefore = cellUtil.isBefore(cell3, cell1);
        assert.isTrue(isBefore);
        isNotBefore = cellUtil.isBefore(cell2, cell1);
        assert.isTrue(isBefore);
    });
});