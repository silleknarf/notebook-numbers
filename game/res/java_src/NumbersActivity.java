package src.silleknarf.game;

import java.util.ArrayList;

import silleknarf.game.R;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.media.AudioManager;
import android.media.ToneGenerator;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.widget.Button;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.Toast;

public class NumbersActivity extends Activity {
    /** Called when the activity is first created. */
	
	
	int[] selected = new int[]{0,0};
	Boolean madeMove = true;
	Logic gameLogic = new Logic();
	int gameWidth = 9;
	ArrayList<int[]> grid = gameLogic.gridNumbers(gameWidth);
	int[] numbers = new int[]{R.drawable.one,R.drawable.two,R.drawable.three,R.drawable.four,R.drawable.five,R.drawable.six,R.drawable.seven,R.drawable.eight,R.drawable.nine};
	
	@Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        
        // Get the preferences for whether the game has been played before
        SharedPreferences prefs = getSharedPreferences("MyPreferences", Context.MODE_PRIVATE);
        boolean haveWeShownPreferences = true;
        haveWeShownPreferences = prefs.getBoolean("HaveShownPrefs", false);
        
        // If game has not been played initialize the variables for the free game count and
        // show the tutorial
        if (!haveWeShownPreferences) {
            loadGame(false);
        	Intent myIntent = new Intent(this, Tutorial.class);
        	this.startActivity(myIntent);
        	SharedPreferences.Editor ed = prefs.edit();
            ed.putBoolean("HaveShownPrefs", true);
            ed.commit();
            
            SharedPreferences prefers = getSharedPreferences("FreeGames", Context.MODE_PRIVATE);
            SharedPreferences.Editor eds = prefers.edit();
    		eds.putInt("games", 1);
    		eds.commit();
    	// If they game has been played before load the last save
        } else {
    		loadGame(true);
        }
        
        // Add the code to run the appropriate function for each button
        Button newgame = (Button) findViewById(R.id.newgame);
        newgame.setOnClickListener(new View.OnClickListener() {
			public void onClick(View v) {
				newGame();
			}
		});
        Button refill = (Button) findViewById(R.id.refill);
        refill.setOnClickListener(new View.OnClickListener() {
			public void onClick(View v) {
				refillGrid();
			}
		});
        Button tutorial = (Button) findViewById(R.id.tutorial);
        tutorial.setOnClickListener(new View.OnClickListener() {
			public void onClick(View v) {
				showTutorial();
			}
		});
    }
	// Custom overrides to save the game when it is closing
	@Override
    protected void onStop() {
        super.onStop();
		saveGame(grid);
        // The activity is no longer visible (it is now "stopped")
    }
	@Override
    protected void onDestroy() {
        super.onDestroy();
		saveGame(grid);
        // The activity is no longer visible (it is now "stopped")
    }
	
	// Method to save the game in shared preferences
	// Games are saved as strings i.e. "A2345678A" with each line saved as "0","1","2",etc
	public void saveGame(ArrayList<int[]> grid) {
        SharedPreferences prefs = getSharedPreferences("SaveGame", Context.MODE_PRIVATE);
		SharedPreferences.Editor ed = prefs.edit();
		for (int i = 0; i < grid.size(); i++) {
			String lineAsString = "";
			for (int j = 0; j < grid.get(0).length; j++) {
				Integer number = (Integer)grid.get(i)[j];
				if (number==-1) {
					lineAsString = lineAsString.concat("A");
				} else {
					lineAsString = lineAsString.concat(number.toString());
				}
			}
			Log.v("line",lineAsString);
	        ed.putString(((Integer)i).toString(), lineAsString);
		}
		// Also saving the size of the game
        ed.putInt("NumberLines", grid.size());
        ed.commit();
	}
	
	// Loads the game when it is started loads it by clearing the grid entirely and
	// then refilling it with the saved game from shared preferences
	public void loadGame(boolean fromSave) {
		SharedPreferences prefs = getSharedPreferences("SaveGame", Context.MODE_PRIVATE);
		int numberLines = prefs.getInt("NumberLines", 0);
		int index = 0;
        TableLayout tl = (TableLayout) findViewById(R.id.theGrid);
        // Clears the original game
        tl.removeAllViewsInLayout();
        
		if (!fromSave) {
			numberLines = grid.size();
		} else {
			if (numberLines==0) 
				return;
			
	        Log.v("original",((Integer)grid.size()).toString());
	        for (int i = 0; i <= grid.size();i++) {
	        	grid.remove(i);
	        }
	        // Creates an empty grid
			Log.v("withremoved",((Integer)grid.size()).toString());
	        for (int i = 0; i < numberLines-1; i++) {
	        	grid.add(new int[gameWidth]);
	        }
	        
			Log.v("numberlines",((Integer)numberLines).toString());
			Log.v("fullgridsize",((Integer)grid.size()).toString());			
		}
		
		// Fills the grid with the saved game
		for (int i = 0; i < numberLines; i++) {
			TableRow tr = new TableRow(this);
			String line = prefs.getString(((Integer)i).toString(), "123456789");
			for (int j = 0; j < grid.get(0).length; j++) {
				char numberChar;
				int number;
				if (!fromSave) {
					number = grid.get(i)[j];
					numberChar = 'x';
				} else {
					number = -2;
					numberChar = line.charAt(j);
				}
				Button numberButton = new Button(this);
				numberButton.setId(700+index);
				// Sets the button as blank if it is a 0
				if (numberChar=='0' || number == 0) {
					grid.get(i)[j] = 0;
					numberButton.setBackgroundColor(0);
				// Sets the button as crossed out if there is an A
				} else if (numberChar=='A' || number == -1) {
					grid.get(i)[j] = -1;
					Log.v("load","-1");
					numberButton.setBackgroundResource(R.drawable.scribble);
				// Otherwise it converts the number from char digit to an int
				// and add it to the grid
				} else {
					if (fromSave) {
						number = (int)numberChar-48;
					}
					Log.v("gridsize: ",((Integer)grid.size()).toString());
					Log.v("gridwidth: ",((Integer)grid.get(i).length).toString());
					Log.v("i: ",((Integer)i).toString());
					Log.v("j: ",((Integer)j).toString());
					grid.get(i)[j] = number;
					Log.v("load",((Integer)number).toString());
					// Sets the appropriate number image for number in the grid
					numberButton.setBackgroundResource(numbers[number-1]);
					numberButton.setOnClickListener(new View.OnClickListener() {
						public void onClick(View v) {
							// Attempt to make a move with the current grid number and the 
							// number previously selected
							ToneGenerator toneGenerator = new ToneGenerator(AudioManager.STREAM_SYSTEM,ToneGenerator.MAX_VOLUME);
							
							
							if (!gameLogic.isMovePossible(grid, idConverter(v.getId()),selected) && madeMove == false) {
								Log.v("beep","I beeped");
								toneGenerator.startTone(ToneGenerator.TONE_PROP_BEEP);
								madeMove = true;
							} else if (!gameLogic.isMovePossible(grid, idConverter(v.getId()),selected)) {
								Log.v("beep","I wanted to beep but I managed to restrain myself");
								madeMove = false;
							} else {
								Log.v("beep","I didn't beep");
								madeMove = true;
							}
							grid = gameLogic.makeMove(grid, idConverter(v.getId()),selected);
							
							// Checks if the game is won and gives and appropriate message
							if (gameLogic.gameWon(grid)) {
								Toast.makeText(getBaseContext(), "Congratulations, you've beat the game!", 300).show();
							}
							selected = idConverter(v.getId());
							loadGame(false);
							saveGame(grid);
						}
					});
				}
				tr.addView(numberButton);
				index++;
			}
			tl.addView(tr);
		}
	}
	// Makes the game save if the back button is pressed
	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event)  {
	    if (keyCode == KeyEvent.KEYCODE_BACK && event.getRepeatCount() == 0) {
	        saveGame(grid);
	        finish();
	        return true;
	    }
	    return super.onKeyDown(keyCode, event);
	}
	
	public void newGame() {
		// Finds out how many free games have been played
		SharedPreferences prefs = getSharedPreferences("FreeGames", Context.MODE_PRIVATE);
		int freeGames = prefs.getInt("games", 0);
		// Finds whether the full version is being played
		boolean paid = false;
		if (this.getString(R.string.free).contentEquals("1")) {
			paid = true;
		}
		// If free games have all been used and they're on the free version, game isn't reset
		// buy the game message is shown
		if (freeGames > 10 && !paid) {
			AlertDialog.Builder builder = new AlertDialog.Builder(this);
			builder.setMessage("You have used your 10 free games, would you like to buy the full version?")
			       .setCancelable(false)
			       .setPositiveButton("Yes", new DialogInterface.OnClickListener() {
			           public void onClick(DialogInterface dialog, int id) {
			        	   Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=silleknarf.game"));
			        	   startActivity(browserIntent);          
			        	   }
			       })
			       .setNegativeButton("No", new DialogInterface.OnClickListener() {
			           public void onClick(DialogInterface dialog, int id) {
			                dialog.cancel();
			           }
			       });
			AlertDialog alert = builder.create();
			alert.show();
		} else { 
			grid = gameLogic.gridNumbers(gameWidth);
			saveGame(grid);
			loadGame(false);
		}
		// Counts the game in the games used count
		freeGames++;
    	SharedPreferences.Editor ed = prefs.edit();
		ed.putInt("games", freeGames);
		ed.commit();
	}
	// Fills the numbers that haven't been used in at the bottom of the grid
	public void refillGrid() {
		grid = gameLogic.refillGrid(grid);
		loadGame(false);
	}
	// Opens the tutorial
	public void showTutorial() {
		Intent myIntent = new Intent(this, Tutorial.class);
		this.startActivity(myIntent);
	}
	
	// Converts the given id for a button into a grid co-ord
    int[] idConverter(int id) {
    	id = id - 700;
    	int[] output = new int[2];
    	output[1] = id / gameWidth; 
    	output[0] = id % gameWidth;
    	return output;
    }
    // Converts the given co-ord into a id for a button
    int idConverter(int[] square) {
    	int x = square[0];
    	int y = square[1]*gameWidth;
    	return x+y+700;
    }
}