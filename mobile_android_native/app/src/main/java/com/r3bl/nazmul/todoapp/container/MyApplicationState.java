package com.r3bl.nazmul.todoapp.container;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.apache.commons.lang3.SerializationUtils;

import java.io.Serializable;
import java.util.ArrayList;

/**
 * Created by nazmul on 11/8/16.
 */

public class MyApplicationState implements Serializable {
UserObject          user      = null;
ArrayList<TodoItem> todoArray = null;

@Override
public String toString() {
  Gson gson = new GsonBuilder().setPrettyPrinting()
                               .serializeNulls()
                               .create();
  return gson.toJson(this);
}

public MyApplicationState deepCopy() {
  return SerializationUtils.clone(this);
}

}// end class ApplicationState