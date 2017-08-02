var levelSystem = function(eventManager) {
    var my = this;
    my.currentLevel = 1;
    my.currentUnlockedLevel = 1;
    my.nextLevel = 1;

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

    my.levels = [
        [[1,9,5,1,5,1,1,9,5],[5,9,1,5,9,1,5,5,1]],
        [[1,2,3,2,2,3,1,2,3],[2,3,1,2,3,1,2,2,1]],
        [[2,1,4,2,1,4,2,1,4],[1,2,4,1,1,3,4,2,1]],
        generateClassicGrid(),
        [[1,9,1,2,3,4,5,6,7],[2,3,4,5,6,7,8,8,2],[7,3,1,2,3,4,5,6,7]],
        [[1,2,3,4,5,6,7,8,9],[2,3,4,5,6,7,8,9,1],[3,4,5,6,7,8,9,1,2]]
    ];

    // Get the level currently in play
    var getCurrentLevelNumber = function() {
        this.number = my.currentLevel;
    }

    // Start a new level
    var getLevelGrid = function() {
        my.currentLevel = my.nextLevel;
        this.number = my.nextLevel;
        this.grid = _.cloneDeep(my.levels[my.currentLevel-1]);
        saveLevel();
    }

    // Get the level of what a new level would be
    var getNextLevelNumber = function() {
        this.number = my.nextLevel;
    }

    // Cycle through the unlocked levels
    var nextLevel = function() {
        my.nextLevel++;
        if (my.nextLevel > my.currentUnlockedLevel)
            my.nextLevel = 1;
    }

    // Unlock a level if you have progressed
    var unlockLevel = function() {
        var nextLevel = my.currentLevel + 1;
        if (nextLevel > my.currentUnlockedLevel && nextLevel < my.levels.length)
            my.currentUnlockedLevel = nextLevel;
        saveLevel();
    };

    // Save the level to local storage
    var saveLevel = function() {
        localStorage.setItem('currentLevel', JSON.stringify(my.currentLevel));
        localStorage.setItem('currentUnlockedLevel', JSON.stringify(my.currentUnlockedLevel));
    }

    var getIntFromLocalStorage = function(key) {
        var value = localStorage.getItem(key);
        if (value && value !== "undefined")
            return JSON.parse(value);
        return 1;
    }

    // Load the current level and unlocked levels from local storage
    var loadLevel = function() {
        my.currentLevel = getIntFromLocalStorage("currentLevel");
        my.currentUnlockedLevel = getIntFromLocalStorage("currentUnlockedLevel");
    }

    var initialiseEvents = function() {
        eventManager.vent.on("SYSTEM:LEVEL:GET_GRID", getLevelGrid);
        eventManager.vent.on("SYSTEM:LEVEL:GET_CURRENT_NUMBER", getCurrentLevelNumber);
        eventManager.vent.on("SYSTEM:LEVEL:GET_NEXT_NUMBER", getNextLevelNumber);
        eventManager.vent.on("SYSTEM:LEVEL:NEXT", nextLevel);
        eventManager.vent.on("SYSTEM:LEVEL:LOAD", loadLevel);
        eventManager.vent.on("SYSTEM:LOGIC:GRID_COMPLETED", unlockLevel);
        eventManager.vent.on("SYSTEM:LOGIC:GRID_COMPLETED", nextLevel);
    };
    initialiseEvents();
};