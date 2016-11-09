package com.r3bl.nazmul.todoapp.container;

import android.support.annotation.NonNull;
import android.util.Log;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

/**
 * Created by nazmul on 11/8/16.
 */

public class MyApplicationAuth implements FirebaseAuth.AuthStateListener {

private static final String TAG = MyApplicationAuth.class.getSimpleName();
private final FirebaseAuth  _auth;
private final MyApplication _ctx;

public MyApplicationAuth(MyApplication myApplication) {
  _ctx = myApplication;
  _auth = FirebaseAuth.getInstance();
  attachAuthListener();
}

public void attachAuthListener() {
  _auth.addAuthStateListener(this);
}

public void detachAuthListener() {
  _auth.removeAuthStateListener(this);
}

@Override
public void onAuthStateChanged(@NonNull FirebaseAuth firebaseAuth) {
  FirebaseUser user = firebaseAuth.getCurrentUser();
  Log.d(TAG, String.format("onAuthStateChanged: user=%s", user));

  if (user != null) {
    // user is signed in (auth or social)
    // TODO: 11/8/16 user is signed in ... do something

  } else {
    // user isn't signed in
    // TODO: 11/8/16 kick off anonymous auth

  }

}

}// end class MyApplicationAuth