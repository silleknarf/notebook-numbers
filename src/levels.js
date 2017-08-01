var getLevel = function(level) {
    var generateClassicGrid = function() {
        var data = [[], [], []];
        var firstRow = data[0];
        var secondRow = data[1];
        var thirdRow = data[2];
        for (var i = 1; i<=config.numColumns; i++) {
            firstRow[i-1] = i;
            if (i%2==1) {
                secondRow[i-1] = 1;
            } else {
                secondRow[i-1] = i/2;
            }
            if (config.numColumns%2==1) {
                if (i%2==1) {
                    thirdRow[i-1] = (i/2)+((config.numColumns/2)+1)-1;
                } else {
                    thirdRow[i-1] = 1;
                }   
            } else {
                if (i%2==1) {
                    thirdRow[i-1] = 1;
                } else {
                    thirdRow[i-1] = (i/2)+((config.numColumns/2)+1)-1;
                }   
            }
        }
        return data;
    };

    if (level === 1) {
        return [[1,9,5,1,5,1,1,9,5],[5,9,1,5,9,1,5,5,1]];
    } else if (level === 2) {
        return [[1,2,3,2,2,3,1,2,3],[2,3,1,2,3,1,2,2,1]];
    } else if (level === 3) {
        return [[2,1,4,2,1,4,2,1,4],[1,2,4,1,1,3,4,2,1]];
    } else if (level === 4) {
        return generateClassicGri();
    } else if (level === 5) {
        return [[1,9,1,2,3,4,5,6,7],[2,3,4,5,6,7,8,8,2],[7,3,1,2,3,4,5,6,7]];
    } else if (level === 6) {
        return [[1,2,3,4,5,6,7,8,9],[2,3,4,5,6,7,8,9,1],[3,4,5,6,7,8,9,1,2]];
    }
};