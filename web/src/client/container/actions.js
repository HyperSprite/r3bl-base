/**
 * these are all the named redux actions
 */
const TYPES = {
  SET_STATE_USER: 'SET_STATE_USER',
  SET_STATE_DATA: 'SET_STATE_DATA',
  ADD_TODO: 'ADD_TODO',
  TOGGLE_TODO: 'TOGGLE_TODO',
  REDUX_INIT: 'REDUX_INIT',
};
function action_init() {
  return {
    type: TYPES.REDUX_INIT,
    payload: null,
  };
}
function action_set_state_user(user) {
  return {
    type: TYPES.SET_STATE_USER,
    payload: user,
  };
}
function action_set_state_data(data) {
  return {
    type: TYPES.SET_STATE_DATA,
    payload: data,
  };
}
function action_add_todo_text(text) {
 return {
    type: TYPES.ADD_TODO,
    payload: text,
  };
}
function action_toggle_todo_index(index) {
  return {
    type: TYPES.TOGGLE_TODO,
    payload: index,
  };
}
export { TYPES, action_set_state_data, action_set_state_user, action_toggle_todo_index, action_add_todo_text, action_init };
