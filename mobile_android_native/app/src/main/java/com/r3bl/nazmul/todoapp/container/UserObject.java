package com.r3bl.nazmul.todoapp.container;

import com.google.firebase.auth.UserInfo;
import com.google.firebase.database.ServerValue;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.io.Serializable;

/**
 * Created by nazmul on 11/10/16.
 */

public class UserObject implements Serializable {
public Object  timestamp;
public String  uid;
public String  providerId;
public String  displayName;
public String  photoUrl;
public String  email;
public boolean emailVerified;
public boolean isAnonymous;

public UserObject(UserInfo param) {
  if (param.getUid() != null) {
    uid = param.getUid();
  }
  if (param.getProviderId() != null) {
    providerId = param.getProviderId();
  }
  if (param.getDisplayName() != null) {
    displayName = param.getDisplayName();
  }
  if (param.getPhotoUrl() != null) {
    photoUrl = param.getPhotoUrl().toString();
  }
  if (param.getEmail() != null) {
    email = param.getEmail();
  }
  emailVerified = param.isEmailVerified();
  isAnonymous = (param.getProviderId() != null);

  timestamp = ServerValue.TIMESTAMP;
}

/**
 * more info on firebase server side timestamps and android - https://goo.gl/l4FNQk
 */
public long getTimestamp() {
  try {
    return (long) timestamp;
  } catch (Exception e) {
    return -1;
  }
}

@Override
public String toString() {

  Gson gson = new GsonBuilder().setPrettyPrinting()
                               .serializeNulls()
                               .create();
  return gson.toJson(this);

}

}// end class UserObject