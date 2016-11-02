// @flow
//
// List of all Flow types used in the container and ui package.
// These only apply to the files with '// flow' at the top.

export type ReduxActionIF = {
  type: string,
  payload: any,
}

export type ChatMessageIF = {
  message: string,
  displayName: string,
  timestamp: number,
  photoURL: string,
  sessionId: string,
}

export type GCMessageItemIF = {
  key: number,
  index: number,
  avatarIconSize: number,
  chatMessage: ChatMessageIF,
}

/** this represents a user object */
export type UserIF = {
  displayName: string;
  photoURL: string;
  isAnonymous: boolean;
  email: string;
  emailVerified: boolean;
  uid: string;
  timestamp: any;
  googleAccessToken?: any;
}

export type PresenceIF = {
  status: string,
  user: UserIF,
}

/** holds information about the user who is signed in */
export type AuthStateIF = {
  oldUid?: string;
  newUid?: string;
  newUser?: UserIF;
  oldUser?: UserIF;
}

/** this represents a constituent element of the todoArray */
export type TodoIF = {
  item: string;
  done: boolean;
}

/** this represents the data that is stored in firebase */
export type DataIF = {
  todoArray: TodoIF[];
  sessionId?: any;
  timestamp?: any;
}

export type ReduxStateIF = {
  user: UserIF,
  data: DataIF,
}

export type ApplicationContextIF = {
  sessionId?: any;
}

// these are Action Creator Strings, see actions.js file
export type ActionStrings = (
  'SET_STATE_USER' |
  'SET_STATE_DATA' |
  'ADD_TODO' |
  'TOGGLE_TODO' |
  'REDUX_INIT'
)
