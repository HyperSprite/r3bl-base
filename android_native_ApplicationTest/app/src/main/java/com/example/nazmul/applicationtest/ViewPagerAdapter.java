package com.example.nazmul.applicationtest;

import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;
import com.example.nazmul.applicationtest.fragment2.Fragment2;

public class ViewPagerAdapter extends FragmentPagerAdapter {

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