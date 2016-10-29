// @flow
// HyperSprite-TODO - More flow typing: 2, missing state and action
import lodash from 'lodash';
import * as actions from './actions';
import { applicationContext } from './context';

/**
 * these are initialized with null to match Firebase, since it doens't store any
 * empty values and set empty values to null
 * @type {{user: any; data: any}}
 */
const initialState = {
  user: null,
  data: null,
};
function add_todo(state, action) {
  const todo_text = action.payload;
  if (!lodash.isNil(todo_text)) {
    let data_copy = lodash.cloneDeep(state.data);
    let todoObject = {
      item: todo_text,
      done: false,
    };
    if (lodash.isNil(data_copy)) {
      data_copy = { todoArray: [todoObject] };
    } else {
      data_copy.todoArray.push(todoObject);
    }
    const retval = {
      user: state.user,
      data: data_copy,
    };
    return retval;
  } else {
    return state;
  }
}
function toggle_todo(state, action) {
  try {
    const index = action.payload;
    let data_copy = lodash.cloneDeep(applicationContext.getData());
    let todoObject = data_copy.todoArray[index];
    todoObject.done = !todoObject.done;
    const retval = {
      user: state.user,
      data: data_copy,
    };
    return retval;
  } catch (e) {
    console.log('_modifyTodoItem had a problem ...');
    console.dir(e);
  }
  return state;
}
function set_data(state, action) {
  const retval = {
    data: action.payload,
    user: state.user,
  };
  return retval;
}
function set_user(state, action) {
  const retval = {
    data: state.data,
    user: action.payload,
  };
  return retval;
}
function reducer_main(state, action) {
  switch (action.type) {
    case actions.TYPES.REDUX_INIT:
      return initialState;
    case actions.TYPES.ADD_TODO:
      return add_todo(state, action);
    case actions.TYPES.TOGGLE_TODO:
      return toggle_todo(state, action);
    case actions.TYPES.SET_STATE_DATA:
      return set_data(state, action);
    case actions.TYPES.SET_STATE_USER:
      return set_user(state, action);
  }
}

export { reducer_main, initialState };
