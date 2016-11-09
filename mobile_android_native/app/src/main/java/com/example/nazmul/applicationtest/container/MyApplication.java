package com.example.nazmul.applicationtest.container;

import android.app.Application;
import android.util.Log;
import com.brianegan.bansa.BaseStore;
import com.brianegan.bansa.Reducer;

/**
 * Created by nazmul on 10/26/16.
 */

public class MyApplication extends Application {

private static final String TAG = MyApplication.class.getSimpleName();
private BaseStore<MyApplicationState> _store;
private MyApplicationAuth _auth;

//
// Constructor
//

@Override
public void onCreate() {
  super.onCreate();
  Log.d(TAG, "onCreate: [START]");

  _initReduxStore();

  Log.d(TAG, "onCreate: created a new redux store object");
  String msg = getStore().getState().toString();
  Log.d(TAG, String.format("{%s}", msg));

  _initFirebaseAuth();

  Log.d(TAG, String.format("onCreate: [END]", msg));
}

//
// Auth
//

private void _initFirebaseAuth() {
   _auth = new MyApplicationAuth(this);
}

public MyApplicationAuth getAuth() {
  return _auth;
}

//
// Redux store
//

private void _initReduxStore() {
  MyApplicationState state = new MyApplicationState();
  Reducer<MyApplicationState> reducer = new MyApplicationReducer();
  _store = new BaseStore<>(state, reducer);
}

public MyApplicationState getState() {
  return _store.getState();
}

public BaseStore<MyApplicationState> getStore() {
  return _store;
}

}// end MyApplication class