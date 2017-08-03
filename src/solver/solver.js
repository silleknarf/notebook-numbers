var solver = {
    run: function() { 

        config = { numColumns: 9 };
        var gridUtil = gridUtilFactory(cellUtilFactory());

        // Take the cells in the current grid and
        // Pair them with all of the directions 
        var getMoves = function(grid) {
            var moves = [];
            _.forEach(
                grid,
                function(row, i) {
                    _.forEach(
                        row,
                        function(cell, j) {
                            _.forEach(
                                _.range(4),
                                function(direction) {
                                    if (cell === 0)
                                        return;

                                    var move = {
                                        i: i,
                                        j: j,
                                        direction: direction
                                    }
                                    moves.push(move);
                                });
                        });
                });
            return moves;
        }

        var checkInDirecion = function(grid, move, incrementFunc, checkFunc) {
            var moveToCheck = _.clone(move);
            incrementFunc(moveToCheck);
            while (checkFunc(moveToCheck)) {
                var isValid = gridUtil.check(grid, move, moveToCheck);
                if (isValid)
                    return moveToCheck;
                incrementFunc(moveToCheck);
            }
            return false;
        }

        var check = function(grid, move) {
            var maybeMove;
            if (move.direction === 0) {
                maybeMove = checkInDirecion(
                    grid, 
                    move, 
                    function(cell) { cell.i--; },
                    function(cell) { return cell.i >= 0; });
            } else if (move.direction === 1) {
                maybeMove = checkInDirecion(
                    grid, 
                    move, 
                    function(cell) { cell.i++; },
                    function(cell) { return cell.i < grid.length; });
            } else if (move.direction === 2) {
                maybeMove = checkInDirecion(
                    grid, 
                    move, 
                    function(cell) { 
                        cell.j--; 
                        if (cell.j < 0) {
                            cell.i--;
                            cell.j = 0;
                        }
                    },
                    function(cell) { return cell.j >= 0 && cell.i >= 0; });
            } else {
                maybeMove = checkInDirecion(
                    grid, 
                    move, 
                    function(cell) { 
                        cell.j++; 
                        if (cell.j > grid[cell.i].length) {
                            cell.i++;
                            cell.j = 0;
                        }
                    },
                    function(cell) { return cell.i < grid.length && cell.j < grid[cell.i].length; });
            }

            if (maybeMove)
                return [move, maybeMove];

            return false;
        }

        // Try to play the moves in all directions 
        var runMoves = function(grid, moves) {
            var moveMade = false;
            _.forEach(
                moves,
                function(move) {
                    var maybeMove = check(grid, move);
                    if (maybeMove) {
                        moveMade = maybeMove;
                        gridUtil.makeMove(grid, maybeMove[0], maybeMove[1]);
                        return false;
                    }
                });
            return moveMade;
        }

        var solveGrid = function(grid) {
            var gridToSolve = _.cloneDeep(grid);
            var movesMade = [];
            var gridCompleted = false;
            var iterations = 0;
            var maxIterations = 10;

            while (!gridCompleted && iterations <= maxIterations) {
                var moves = _.shuffle(getMoves(gridToSolve));

                var moveMade = runMoves(gridToSolve, moves);
                if (moveMade)
                    movesMade.push(moveMade);

                gridCompleted = gridUtil.checkCompleted(gridToSolve);

                if (!gridCompleted && !moveMade) {
                    gridUtil.refillGrid(gridToSolve);
                } 

                iterations++;
            }
            if (gridCompleted)
                return movesMade;
            return false;
        }

        console.log(levels[3]);
        var solvedTimes = 0;
        _.forEach(
            _.range(1000), 
            function() { 
                var gridSolution = solveGrid(levels[3]);
                if (gridSolution)
                    solvedTimes++;
            });
        console.log("Solved " + solvedTimes + " out of 1000");
    },
};

solver.run();