package com.r3bl.nazmul.todoapp.container;

import com.brianegan.bansa.Action;
import com.google.firebase.auth.UserInfo;

/**
 * Created by nazmul on 11/10/16.
 */

public class MyApplicationActions {

public enum ActionType {
  ADD_TODO_ITEM,
  SET_USER,
  SET_DATA,
}

public interface MyApplicationAction extends Action {
  public ActionType getType();

  public Object getParam();
}

public static MyApplicationAction addTodoItem(String item, boolean done) {
  return new MyApplicationAction() {
    @Override
    public ActionType getType() {
      return ActionType.ADD_TODO_ITEM;
    }

    @Override
    public Object getParam() {
      return new TodoItem(item, done);
    }
  };
}

public static MyApplicationAction setUser(UserInfo user) {
  return new MyApplicationAction() {
    @Override
    public ActionType getType() {
      return ActionType.SET_USER;
    }

    @Override
    public Object getParam() {
      return user;
    }
  };
}


}// end class MyApplicationActions