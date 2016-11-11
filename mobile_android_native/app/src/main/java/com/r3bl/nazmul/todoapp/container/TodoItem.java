package com.r3bl.nazmul.todoapp.container;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.io.Serializable;

/**
 * Created by nazmul on 11/10/16.
 */
public class TodoItem implements Serializable {
public TodoItem(String item, boolean done) {
  this.done = done;
  this.item = item;
}

boolean done;
String  item;

@Override
public String toString() {
  Gson gson = new GsonBuilder().setPrettyPrinting()
                               .serializeNulls()
                               .create();
  return gson.toJson(this);
}

}// end class TodoItem