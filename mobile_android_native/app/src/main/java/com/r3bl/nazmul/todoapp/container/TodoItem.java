package com.r3bl.nazmul.todoapp.container;

import java.io.Serializable;

/**
 * Created by nazmul on 11/10/16.
 */
public class TodoItem implements Serializable {
  public TodoItem(String item, boolean done) {
    this.done = done;
    this.item = item;
  }

  String  item;
  boolean done;
}
