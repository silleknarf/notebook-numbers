package src.silleknarf.game;

import silleknarf.freegame.R;
import android.app.Activity;
import android.graphics.drawable.BitmapDrawable;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;

public class Tutorial extends Activity {
	public int page;
	public ImageView tut;
//	public Button backBut;
	public Button nextBut;
	    @Override
		public void onCreate(Bundle savedInstanceState) {
	        super.onCreate(savedInstanceState);
	        setContentView(R.layout.tutorial);
	        
    		
	        this.tut = (ImageView) findViewById(R.id.tutor);
   // 		((BitmapDrawable)tut.getDrawable()).getBitmap().recycle();
	/*      backBut = (Button) findViewById(R.id.backbutton);
	        backBut.setOnClickListener(new View.OnClickListener() {
				public void onClick(View v) {
					back();
				}
			}); */
	        this.nextBut = (Button) findViewById(R.id.nextbutton);
	        this.nextBut.setOnClickListener(new View.OnClickListener() {
				@Override
				public void onClick(View v) {
					next();
				}
			});
	        this.page = 0;
	    }
	    
	    // Changes the page when the back button is pressed and deals 
	    // with the button functions (not used)
	    public void back() {
	    	
	    	this.page--;
	    	if (this.page==-1) {
	    		this.page = 0;
	    	}
	    	if (this.page==0) {
//	    		backBut.setEnabled(false);
	    	}
	    	if (this.page==2) {
	    		this.nextBut.setBackgroundResource(R.drawable.next);
	    	}
	    	changeImage();
	    	
	    }
	    
	    // Changes the page when the next button is pressed and deals 
	    // with the button functions
	    public void next() {
	    	this.page++;
	    	if (this.page==4) {
	    		LinearLayout layout = (LinearLayout)findViewById(R.id.linlayout);
	    		layout.removeAllViews();
	    		this.finish();
	    	} else {
	    		((BitmapDrawable)this.tut.getDrawable()).getBitmap().recycle();
	    	}
	    	if (this.page==3) {
	    		this.nextBut.setBackgroundResource(R.drawable.done);
	    	}
	    	if (this.page==1) {
	   // 		backBut.setEnabled(true);
	    	}

	    	changeImage();
	    }
	    
	    // Changes the image to the resource at index 'page' in pages
	    public void changeImage(){
	    	int[] pages = new int[]{R.drawable.page1,R.drawable.page2,R.drawable.page3,R.drawable.page4};
	    	if (this.page!=4) 
	    		this.tut.setImageResource(pages[this.page]);
	    }
}