package com.r3bl.nazmul.todoapp.container;

import org.apache.commons.lang3.SerializationUtils;

import java.io.Serializable;
import java.util.ArrayList;

/**
 * Created by nazmul on 11/8/16.
 */

public class MyApplicationState implements Serializable {
UserObject          user              = null;
ArrayList<TodoItem> todoItemArrayList = null;

@Override
public String toString() {
  return String.format("Redux State: user=%s, data=%s", user, todoItemArrayList);
}

public MyApplicationState deepCopy() {
  return SerializationUtils.clone(this);
}

}// end class ApplicationState