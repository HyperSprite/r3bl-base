// @flow
/**
 * these are all the named redux actions
 */

const TYPES: {[key: ActionStrings]: ActionStrings} = {
  SET_STATE_USER: 'SET_STATE_USER',
  SET_STATE_DATA: 'SET_STATE_DATA',
  ADD_TODO: 'ADD_TODO',
  TOGGLE_TODO: 'TOGGLE_TODO',
  REDUX_INIT: 'REDUX_INIT',
};

function actionInit() {
  return {
    type: TYPES.REDUX_INIT,
    payload: null,
  };
}
function actionSetStateUser(user: UserIF) {
  return {
    type: TYPES.SET_STATE_USER,
    payload: user,
  };
}
function actionSetStateData(data: DataIF) {
  return {
    type: TYPES.SET_STATE_DATA,
    payload: data,
  };
}
function actionAddTodoText(text: string) {
  return {
    type: TYPES.ADD_TODO,
    payload: text,
  };
}
function actionToggleTodoIndex(index: number) {
  return {
    type: TYPES.TOGGLE_TODO,
    payload: index,
  };
}
export {
  TYPES,
  actionSetStateData,
  actionSetStateUser,
  actionToggleTodoIndex,
  actionAddTodoText,
  actionInit,
};
