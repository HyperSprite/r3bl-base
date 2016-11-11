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
    _ctx.getStore().dispatch(MyApplicationActions.setUser(user));

  } else {
    // user isn't signed in, so kick off anon auth
    _forceAnonSignIn();
  }

}

private void _forceAnonSignIn() {
  _auth.signInAnonymously()
       .addOnCompleteListener(
         task -> {
           Log.d(TAG, "_forceAnonSignIn: anon auth complete");
           if (!task.isSuccessful()) {
             Log.e(TAG, String.format("_forceAnonSignIn: problem with anon auth, %s",
                                      task.getException()));
           }
         });
}

}// end class MyApplicationAuth