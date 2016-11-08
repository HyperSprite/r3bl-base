package com.example.nazmul.applicationtest.container;

import java.util.Random;

/**
 * Created by nazmul on 11/8/16.
 */


// TODO: 11/8/16 actually describe the app state
public class MyApplicationState {
  String user = String.valueOf(new Random().nextInt(1000));
  String data = "data not set";

  @Override
  public String toString() {
    return String.format("Redux State: user=%s, data=%s", user, data);
  }

}// end class ApplicationState