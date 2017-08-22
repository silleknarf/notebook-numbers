var moveTypes = Object.freeze({
    MAKE_MOVE: "make_move",
    CLEAR_LINE: "clear_line",
    REFILL_GRID: "refill_grid"
});

var undoSystem = function(eventManager) {
    var my = {};

    my.undoList = [];
    my.undosRemaining = 3;

    var undo = function() {
        if (my.undosRemaining === 0)
            return; 

        // If the last move was a clear line then it's an implicit move
        // and we always undo them
        var lastMovePeek = my.undoList[my.undoList.length-1];
        while (lastMovePeek && lastMovePeek.type === moveTypes.CLEAR_LINE) {
            eventManager.vent.trigger("SYSTEM:LOGIC:UNDO", lastMovePeek);
            my.undoList.pop();
            lastMovePeek = my.undoList[my.undoList.length-1];
        }

        // Otherwise it's just a normal move to undo
        var lastMove = my.undoList.pop();
        if (lastMove) {
            eventManager.vent.trigger("SYSTEM:LOGIC:UNDO", lastMove);
            my.undosRemaining--;
        } 

        eventManager.vent.trigger("SYSTEM:CURSOR:RESET");
        eventManager.vent.trigger("SYSTEM:BOUNDS:UPDATE");
    };

    var add = function(move) {
        my.undoList.push(move);
    };

    var clear = function() {
        my.undoList = [];
        my.undosRemaining = 3;
    };

    var getUndosRemaining = function() {
        this.undosRemaining = my.undosRemaining;
    }
    
    var initialiseEvents = function() {
        eventManager.vent.on("SYSTEM:UNDO:UNDO", undo);
        eventManager.vent.on("SYSTEM:UNDO:ADD", add);
        eventManager.vent.on("SYSTEM:UNDO:CLEAR", clear);
        eventManager.vent.on("SYSTEM:UNDO:GET_REMAINING", getUndosRemaining);
        eventManager.vent.on("SYSTEM:LOGIC:GRID_COMPLETED", clear);
    };

    initialiseEvents();
}