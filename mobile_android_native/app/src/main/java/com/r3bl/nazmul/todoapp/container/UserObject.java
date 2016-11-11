package com.r3bl.nazmul.todoapp.container;

import com.google.firebase.auth.UserInfo;

import java.io.Serializable;

/**
 * Created by nazmul on 11/10/16.
 */

public class UserObject implements Serializable {
String  uid;
String  providerId;
String  displayName;
String  photoUrl;
String  email;
boolean isEmailVerified;

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
  isEmailVerified = param.isEmailVerified();
}

@Override
public String toString() {
  return "UserObject{" +
         "isEmailVerified=" + isEmailVerified +
         ", email='" + email + '\'' +
         ", photoUrl='" + photoUrl + '\'' +
         ", displayName='" + displayName + '\'' +
         ", providerId='" + providerId + '\'' +
         ", uid='" + uid + '\'' +
         '}';
}
}
