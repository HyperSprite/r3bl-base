package com.example.nazmul.applicationtest.ui;

import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;
import android.support.v4.view.ViewPager;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Toast;
import com.example.nazmul.applicationtest.container.MyApplication;
import com.example.nazmul.applicationtest.R;
import com.example.nazmul.applicationtest.ui.fragment2.Fragment2;
import me.relex.circleindicator.CircleIndicator;


public class MainActivity extends AppCompatActivity {

private static final String TAG = MainActivity.class.getSimpleName();

@Override
protected void onCreate(Bundle savedInstanceState) {
  super.onCreate(savedInstanceState);
  setContentView(R.layout.activity_main);

  // toolbar setup
  Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
  setSupportActionBar(toolbar);

  // fab setup
  FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
  fab.setOnClickListener(
    view ->
      Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
              .setAction("Action",
                         v -> {
                           MyApplication ctx = (MyApplication) getApplicationContext();
                           String msg = ctx.getState().toString();
                           Toast.makeText(MainActivity.this, msg, Toast.LENGTH_SHORT)
                                .show();
                         })
              .show());

  // view pager setup
  ViewPager viewPager = (ViewPager) findViewById(R.id.viewPager);
  ViewPagerAdapter myPagerAdapter = new ViewPagerAdapter(getSupportFragmentManager());
  viewPager.setAdapter(myPagerAdapter);
  CircleIndicator indicator = (CircleIndicator) findViewById(R.id.indicator);
  indicator.setViewPager(viewPager);

}

@Override
protected void onDestroy() {
  super.onDestroy();
  Log.d(TAG, "onDestroy: ran");
}

@Override
public boolean onCreateOptionsMenu(Menu menu) {
  // Inflate the menu; this adds items to the action bar if it is present.
  getMenuInflater().inflate(R.menu.menu_main, menu);
  return true;
}

@Override
public boolean onOptionsItemSelected(MenuItem item) {
  // Handle action bar item clicks here. The action bar will
  // automatically handle clicks on the Home/Up button, so long
  // as you specify a parent activity in AndroidManifest.xml.
  int id = item.getItemId();

  //noinspection SimplifiableIfStatement
  if (id == R.id.action_settings) {
    return true;
  } else if (id == R.id.action_account) {
    Toast.makeText(MainActivity.this, "todo login action", Toast.LENGTH_SHORT)
         .show();
    return true;
  }

  return super.onOptionsItemSelected(item);
}

//
// View pager adapter support
//
class ViewPagerAdapter extends FragmentPagerAdapter {

  public ViewPagerAdapter(FragmentManager fm) {
    super(fm);
  }

  @Override
  public Fragment getItem(int position) {
    switch (position) {
      case 0:
        return Fragment2.newInstance("Group Chat", "This binds to redux");
      case 1:
        return Fragment2.newInstance("Todo List", "This binds to redux");
    }
    return null;
  }

  @Override
  public int getCount() {
    return 2;
  }

  @Override
  public CharSequence getPageTitle(int position) {
    switch (position) {
      case 0:
        return "Group Chat";
      case 1:
        return "Todo List";
    }
    return super.getPageTitle(position);
  }

}

}// end MainActivity class