// @flow
// HyperSprite-TODO - More flow typing: 1 error
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

// We've declared the types for state and action in the main reducer
// So Flow knows the types for all of the states and actions below.

function addTodo(state, action) {
  const todoText: string = action.payload;

  if (!lodash.isNil(todoText)) {
    let dataCopy: DataIF = lodash.cloneDeep(state.data);
    const todoObject: TodoIF = {
      item: todoText,
      done: false,
    };
    if (lodash.isNil(dataCopy)) {
      dataCopy = { todoArray: [todoObject] };
    } else {
      dataCopy.todoArray.push(todoObject);
    }
    const retval = {
      user: state.user,
      data: dataCopy,
    };
    return retval;
  }
  return state;
}

function toggleTodo(state, action) {
  try {
    const index: number = action.payload;
    const dataCopy = lodash.cloneDeep(applicationContext.getData());
    const todoObject = dataCopy.todoArray[index];
    todoObject.done = !todoObject.done;
    const retval = {
      user: state.user,
      data: dataCopy,
    };
    return retval;
  } catch (e) {
    console.log('_modifyTodoItem had a problem ...');
    console.dir(e);
  }
  return state;
}

function setData(state, action) {
  const retval = {
    data: action.payload,
    user: state.user,
  };
  return retval;
}

function setUser(state, action) {
  const retval = {
    data: state.data,
    user: action.payload,
  };
  return retval;
}

function reducerMain(state: ReduxStateIF, action: ReduxActionIF): ReduxStateIF {
  switch (action.type) {
    case actions.TYPES.REDUX_INIT:
      return initialState;
    case actions.TYPES.ADD_TODO:
      return addTodo(state, action);
    case actions.TYPES.TOGGLE_TODO:
      return toggleTodo(state, action);
    case actions.TYPES.SET_STATE_DATA:
      return setData(state, action);
    case actions.TYPES.SET_STATE_USER:
      return setUser(state, action);
    default:
      return state;
  }
}

export { reducerMain, initialState };
