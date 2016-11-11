package com.r3bl.nazmul.todoapp.container;

import android.util.Log;
import com.brianegan.bansa.Action;
import com.brianegan.bansa.Reducer;
import com.google.firebase.auth.UserInfo;

/**
 * Created by nazmul on 11/8/16.
 */
public class MyApplicationReducer implements Reducer<MyApplicationState> {

public static String TAG = MyApplicationReducer.class.getSimpleName();

@Override
public MyApplicationState reduce(MyApplicationState state, Action actionParam) {

  try {

    MyApplicationActions.MyApplicationAction action =
      (MyApplicationActions.MyApplicationAction) actionParam;

    MyApplicationState newState = state.deepCopy();

    switch (action.getType()) {

      case ADD_TODO_ITEM:
        break;
      case SET_USER:
        newState.user = new UserObject((UserInfo) action.getParam());
        break;
      case SET_DATA:
        break;
    }

    Log.d(TAG, "reduce: old state: " + state);
    Log.d(TAG, "reduce: new state: " + newState);

    return newState;

  } catch (Exception e) {
    Log.e(TAG, "reduce: problem running reducer", e);
  }
  return state;
}

}// end class ApplicationReducer