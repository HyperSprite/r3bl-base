package com.example.nazmul.applicationtest.container;

import android.app.Application;
import android.util.Log;

import java.util.HashMap;
import java.util.Random;

/**
 * Created by nazmul on 10/26/16.
 */

public class MyApplication extends Application {
private static final String TAG = MyApplication.class.getSimpleName();
private HashMap<String, String> _state;

@Override
public void onCreate() {
  super.onCreate();
  Log.d(TAG, "onCreate: [START]");
  _state = new HashMap<String, String>();
  Log.d(TAG, "onCreate: created a new state object");
  _state.put(String.valueOf(new Random().nextInt(1000)), "value");
  String msg = _state.toString();
  Log.d(TAG, String.format("onCreate: {%s} [END]", msg));
}

@Override
public void onTerminate() {
  super.onTerminate();
  Log.d(TAG, "onTerminate: ran");
}

public HashMap<String, String> getState(){
  return _state;
}

}