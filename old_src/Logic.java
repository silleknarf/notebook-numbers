package src.silleknarf.game;
import java.util.*; 

public class Logic {

	// Creates an arraylist representing the grid with the normal start values
	ArrayList<int[]> gridNumbers(int amount) {
		ArrayList<int[]> gridNumbers = new ArrayList<int[]>();
		int[] set = new int[amount];
		int[] secondset = new int[amount];
		int[] thirdset = new int[amount];
		for (int i = 1; i<=amount; i++) {
			set[i-1] = i;
			if (i%2==1) {
				secondset[i-1] = 1;
			} else {
				secondset[i-1] = i/2;
			}
			if (amount%2==1) {
				if (i%2==1) {
					thirdset[i-1] = (i/2)+((amount/2)+1);
				} else {
					thirdset[i-1] = 1;
				}	
			} else {
				if (i%2==1) {
					thirdset[i-1] = 1;
				} else {
					thirdset[i-1] = (i/2)+((amount/2)+1)-1;
				}	
			}
		}
		gridNumbers.add(set);
		gridNumbers.add(secondset);
		gridNumbers.add(thirdset);
		
		return gridNumbers;
	}
	// Adds a tuple together
	int[] shiftPair(int[] a, int[] b) {
		return new int[]{a[0]+b[0],a[1]+b[1]};
	}
	// Takes a pair of co-ords and returns true if they add to the given total
	// or are equal
	boolean comparePair(ArrayList<int[]> grid, int[] a, int[] b, int total) {
		/* Debug output
		System.out.println("a ["+a[0]+", "+a[1]+"]");
		System.out.println("b ["+b[0]+", "+b[1]+"]");
		*/
		total = total + 1;
		int first = grid.get(a[1])[a[0]];
		int second = grid.get(b[1])[b[0]];
		if ((first==second)||(first+second==total)) {
			return true;
		} else {
			return false;
		}
	}
	
	// Returns for a given co-ord a list of the valid moves that can be made
	ArrayList<int[]> validMoves(ArrayList<int[]> grid, int[] current) {
		int width = grid.get(0).length;
		ArrayList<int[]> moves = new ArrayList<int[]>();
		if (grid.get(current[1])[current[0]] == -1 || grid.get(current[1])[current[0]] == 0) {
			return moves;
		}
		// Cycles in each of the directions in order to find a valid move
		int[][] adjacents = new int[][]{{1,0},{-1,0},{0,1},{0,-1}};
		
		for (int[] adj : adjacents) {
			int[] victim = shiftPair(current,adj);
// Debug	System.out.println("Y: "+victim[1]+" GridY: "+grid.size());
			// Checks whether the victim square is off the grid
			if ((victim[1]<0)||(victim[1]>=grid.size())) {
				continue;
			}
			// Moves the victim square from line to line
			if (victim[0]<0) {
				victim[0]+=width;
				victim[1]--;
			}
			if (victim[0]==width) {
				victim[0]-=width;
				victim[1]++;
			}
			if ((victim[1]<0)||(victim[1]>=grid.size())) {
				continue;
			}
			// if the square is scribbled out it is played through by this loop
			while (grid.get(victim[1])[victim[0]]==-1) {
				victim = shiftPair(victim,adj);
// Debug		System.out.println("victim: "+victim[0]+", "+victim[1]);
				if (victim[0]<0) {
					victim[0]+=width;
					victim[1]--;
				}
				if (victim[0]==width) {
					victim[0]-=width;
					victim[1]++;
				}
				if ((victim[1]<0)||(victim[1]>=grid.size())) {
					break;
				}
			}
			
			if ((victim[1]<0)||(victim[1]>=grid.size())) {
				continue;
			}

			if (comparePair(grid, current, victim, width)) {
				moves.add(victim);
			}
		}
		return moves;
		
	}
	// Refills the grid with the numbers that are left
	ArrayList<int[]> refillGrid(ArrayList<int[]> grid) {
		// Cycles throught the grid and serves the dual purpose of finding the first blank space
		// in the grid and creates a list of the remaining numbers
		ArrayList<Integer> remainingNumbers = new ArrayList<Integer>();
		int[] freeSpace = new int[2];
		freeSpace[0] = 0;
		freeSpace[1] = grid.size();
		for (int i = 0; i < grid.size(); i++) {
			for (int j = 0; j < grid.get(0).length; j++) {
				int number = grid.get(i)[j];
				if (number != -1 && number != 0) {
					remainingNumbers.add(number);
				}
				if (number==0) {
					freeSpace[0] = j;
					freeSpace[1] = i;
					break;
				}
			}
		}
		// Takes the remaing numbers and fills the grid from the first free space
		for (int number : remainingNumbers) {
			if (freeSpace[0]==grid.get(0).length) {
				freeSpace[1]++;
				freeSpace[0]-=grid.get(0).length;
				grid.add(new int[grid.get(0).length]);
				grid.get(freeSpace[1])[freeSpace[0]] = number;
			} else if (freeSpace[1] == grid.size()) {
				grid.add(new int[grid.get(0).length]);
				grid.get(freeSpace[1])[freeSpace[0]] = number;
			} else {
				grid.get(freeSpace[1])[freeSpace[0]] = number;
			}
			freeSpace[0]++;
			
		}
		return grid;
	}
	// If a given move is a possible move this function makes the move and returns the grid
	ArrayList<int[]> makeMove(ArrayList<int[]> grid, int[] a, int[] b) {
		ArrayList<int[]> possibles = validMoves(grid, a);
		for (int[] possible : possibles) {
			if (possible[0] == b[0] && possible[1] == b[1]) {
				grid.get(a[1])[a[0]] = -1;
				grid.get(b[1])[b[0]] = -1;
			}
		}
		return grid;
	}
	// If a given move is a possible move this function returns true;
		Boolean isMovePossible(ArrayList<int[]> grid, int[] a, int[] b) {
			ArrayList<int[]> possibles = validMoves(grid, a);
			for (int[] possible : possibles) {
				if (possible[0] == b[0] && possible[1] == b[1]) {
					return true;
				} 
			}
			return false;
		}
	// Iterates through the grid and if it finds that there are no more numbers
	// in the game then it returns true
	boolean gameWon(ArrayList<int[]> grid) {
		ArrayList<Integer> remainingNumbers = new ArrayList<Integer>();
		for (int i = 0; i < grid.size(); i++) {
			for (int j = 0; j < grid.get(0).length; j++) {
				int number = grid.get(i)[j];
				if (number != -1 && number != 0) {
					remainingNumbers.add(number);
				}
			}
		}
		return remainingNumbers.size()==0;
	}
	
	/**
	 * @param args
	 */
	/*
	public static void main(String[] args) {
		Logic logic = new Logic();
		
		ArrayList<int[]> grid = logic.gridNumbers(9);
		grid.get(0)[0]=-1;
		grid.get(1)[0]=-1;
		grid.get(1)[1]=8;
		grid.get(0)[7]=-1;
		grid.get(1)[2]=7;
		grid = logic.refillGrid(grid);
		grid = logic.makeMove(grid, new int[]{1,0}, new int[]{1,1});
		grid = logic.makeMove(grid, new int[]{5,5}, new int[]{5,4});
		grid = logic.refillGrid(grid);

		
		for (int[] i : grid) {
			for (int j : i) {
				System.out.print(j+", ");
			}
			System.out.println();
		}
		
		
		ArrayList<int[]> valids = logic.validMoves(grid, new int[]{8,2});
		for (int[] valid : valids) {
			System.out.print(valid[0]+", ");
			System.out.println(valid[1]);

		}
	}
	*/

}
