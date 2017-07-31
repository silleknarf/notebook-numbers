var assert = chai.assert;

describe("grid util", function() {
    it("should make moves", function() {
        var gridUtil = gridUtilFactory(cellUtilFactory());
        var testGrid = [
            [1,1,1],
            [1,0,0]
        ];
        var cell1 = { i: 0, j: 1 };
        var cell2 = { i: 0, j: 2 };
        gridUtil.makeMove(testGrid, cell1, cell2);
        assert.strictEqual(testGrid[0][1], 0);
        assert.strictEqual(testGrid[0][2], 0);
        cell1 = { i: 0, j: 0 };
        cell2 = { i: 1, j: 0 };
        gridUtil.makeMove(testGrid, cell1, cell2);
        assert.strictEqual(testGrid[0].length, 0);
        assert.strictEqual(testGrid[1].length, 0);
    });
    it("should check if the grid has been completed", function() {
        var gridUtil = gridUtilFactory(cellUtilFactory());
        var testGrid = [[1,2,3],[1,0,0]]
        var isCompleted = gridUtil.checkCompleted(testGrid);
        assert.isFalse(isCompleted);
        testGrid = [[0,0,0], "test", [0,0,0]]
        var isCompleted = gridUtil.checkCompleted(testGrid);
        assert.isTrue(isCompleted);
        testGrid = [[],[]]
        var isCompleted = gridUtil.checkCompleted(testGrid);
        assert.isTrue(isCompleted);
    });
    it("should refill the grid", function() {
        var gridUtil = gridUtilFactory(cellUtilFactory());
        var testGrid = [[1,0,3],[1,0,0]]
        config.numColumns = 3;
        gridUtil.refillGrid(testGrid);
        var expectedGrid = [[1,0,3],[1,1,3],[1]];
        assert.deepEqual(testGrid, expectedGrid);
    });
    it("should check whether is a move is possible", function() {
        var gridUtil = gridUtilFactory(cellUtilFactory());
        var testGrid = [[1,0,1],[1,0,0],[0,3,1],[0,0,0],[0,2,1]]
        config.numColumns = 3;
        // Check horizontal
        var isValidMove = gridUtil.check(testGrid, { i: 0, j: 0}, { i: 0, j: 2});
        assert.isTrue(isValidMove);
        // Check horizontal onto next line
        isValidMove = gridUtil.check(testGrid, { i: 1, j: 0}, { i: 2, j: 1});
        assert.isTrue(isValidMove);
        // Check vertical
        isValidMove = gridUtil.check(testGrid, { i: 2, j: 2}, { i: 4, j: 2});
        assert.isTrue(isValidMove);
    });
    it("should save and load grids", function() {
        var gridUtil = gridUtilFactory(cellUtilFactory());
        var testGrid = [[1,2,3]];
        gridUtil.saveGrid(testGrid);
        var loadedGrid = gridUtil.loadGrid();
        assert.deepEqual(loadedGrid, [[1,2,3]]);
    });
})