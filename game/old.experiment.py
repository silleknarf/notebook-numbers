#!/usr/bin/python

class Grid:
    def __init__(self, pattern, width, repeat):
        """Generates a new grid with a repeating pattern and a set width"""
        count = 0
        grid = []
        row = []
        for i in range(repeat):
            for number in pattern:
                count+=1
                row.append(number)
                # Once we have 'width' number of items in the row
                if count%width==0:
                        # Add the row to the grid
                        grid.append(row)
                        row = []

        # Add the last row to the gird if it's half full
        if len(row) != 0:
            grid.append(row)
        self.grid =  grid

    def __str__(self):
        """Prints the grid"""
        output = ""
        for line in self.grid:
            output+=(str(line)+'\n')
        return output


# Experiment
pattern = [1,2,3,4,5,6,7,8,9,8]
gridWidth = 9

if len(pattern) <= gridWidth:
    print "Pattern too short"

for numRepeats in range(11):
    print "Repeats: %d" % (numRepeats)
    print Grid(pattern, gridWidth, numRepeats)

