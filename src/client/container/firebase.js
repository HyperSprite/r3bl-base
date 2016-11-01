// @flow
// HyperSprite-TODO - More flow typing: 9 errors
/**
 * these functions handle dealing with firebase for loading and saving data from it
 */
import lodash from 'lodash';
import { GLOBAL_CONSTANTS, LOGGING_ENABLED } from '../../global/constants';
import * as actions from './actions';
/** firebase database names */
const DB_CONST = {
  USER_ACCOUNT_ROOT: 'USER_ACCOUNT_ROOT',
  USER_DATA_ROOT: 'USER_DATA_ROOT',
  DATA_KEY: 'DATA_KEY',
  SESSION_ID: 'sessionId',
  TIMESTAMP: 'timestamp',
};

/** holds information about the user (anonymous or signed-in) */
let authStateObject = {};
/** holds firebase listener that has on('value') registered */
let firebaseOnListener = null;
/**
 * gets a firebase reference that points to the node where the user's data is stored
 * @param ctx
 * @param id this is the project id
 * @returns {!firebase.database.Reference|firebase.database.Reference}
 * @private
 */
function getUserDataRootRef(ctx, id) {
  if (lodash.isNil(id)) {
    return ctx.getDatabase()
      .ref(DB_CONST.USER_DATA_ROOT);
  }
  return ctx.getDatabase()
    .ref(`${DB_CONST.USER_DATA_ROOT}/${id}`);
}

/**
 * gets a firebase reference that points to the node where the user's account info is
 * stored
 * @param ctx
 * @param id this is the user id
 * @returns {!firebase.database.Reference|firebase.database.Reference}
 * @private
 */
function getUserAccountRootRef(ctx, id) {
  if (lodash.isNil(id)) {
    return ctx.getDatabase()
      .ref(DB_CONST.USER_ACCOUNT_ROOT);
  }
  return ctx.getDatabase()
    .ref(`${DB_CONST.USER_ACCOUNT_ROOT}/${id}`);
}

function processUpdateFromFirebase(snap, ctx) {
  const value = snap.val();
  if (lodash.isNil(value)) {
    // nothing to do!
    return;
  }
  const data = value[DB_CONST.DATA_KEY];
  const payloadSessionId = data[DB_CONST.SESSION_ID];
  const timestamp = data[DB_CONST.TIMESTAMP];
  if (!lodash.isNil(payloadSessionId)) {
    if (lodash.isEqual(payloadSessionId, ctx.getSessionId())) {
      // do nothing! ignore this change ... it was made by me
      // this change has been accounted for with dispatched redux
      // actions already
      if (LOGGING_ENABLED) {
        console.log('loadDataForUserAndAttachListenerToFirebase() - ignoring Firebase' +
                    ' update since I made this change.');
      }
      return;
    }
  }
  // save the user's data
  ctx.getReduxStore()
      .dispatch(actions.actionSetStateData(data));
}

/** this loads the data for the current user and sets it on the context */
function loadDataForUserAndAttachListenerToFirebase(ctx) {
  // check to see if Redux state needs to be rehydrated (this is a one time operation)
  const userId = ctx.getUserId();
  const userDataRootRef = getUserDataRootRef(ctx, userId);
  // if there's an old listener then detach it now
  if (!lodash.isNil(firebaseOnListener)) {
    firebaseOnListener.off('value');
    firebaseOnListener = null;
  }
  // save to detach for next time
  firebaseOnListener = userDataRootRef;
  userDataRootRef.on('value', (snap) => {
    processUpdateFromFirebase(snap, ctx);
  });
}
/**
 * save the given user to firebase ... this also adds a timestamp key with value of
 * ServerValue.TIMESTAMP so that smarter listeners for onChange can be attached
 * more info - https://goo.gl/AbvF03
 * @param ctx
 * @param user
 * @private
 */
function saveUserAccountDataAndSetUser(ctx, user) {
  // note that the timestamp is NOT set on this object ... it will only be set by
  // firebase on the server side when this is set() on the ref
  const userObject = {
    displayName: user.displayName,
    photoURL: user.photoURL,
    isAnonymous: user.isAnonymous,
    email: user.email,
    emailVerified: user.emailVerified,
    uid: user.uid,
    timestamp: ctx.getFirebaseServerTimestampObject(),
  };
  if (!lodash.isNil(user.googleAccessToken)) {
    userObject.googleAccessToken = user.googleAccessToken;
  }
  const rootRef = getUserAccountRootRef(ctx, user.uid);
  // save this to db
  rootRef.set(userObject);
  // save this user object
  ctx.getReduxStore()
      .dispatch(actions.actionSetStateUser(userObject));
  // fire a local event in case anyone wants to know about the login state change
  ctx.emit(GLOBAL_CONSTANTS.LE_SET_USER, userObject);
  // load the rest of the data from firebase
  loadDataForUserAndAttachListenerToFirebase(ctx);
}
/**
 * don't delete the existing user's data .. delete the anon user's data instead
 * the existing (newUser) data already exists (since they are pre-existing)
 * @param ctx
 * @param newUser
 * @private
 */
function migrateUserAnonToExisting(ctx, oldUid, newUser) {
  // remove the old_user (anon user) account
  const userAccountRootRef = getUserAccountRootRef(ctx);
  userAccountRootRef.child(oldUid)
    .remove();
  // remove the old_user (anon user) data
  const userDataRootRef = getUserDataRootRef(ctx);
  userDataRootRef.child(oldUid)
    .remove();
  // get going with the pre-existing user (their data already exists)
  saveUserAccountDataAndSetUser(ctx, newUser);
}

/**
 * there is no pre-existing user, taking the anon-user to brand new signed in user
 * @param ctx
 * @param newUser
 * @private
 */
function migrateUserAnonToNew(ctx, oldUid, newUid, newUser) {
  // migrate data from the old user
  const userDataRootRef = getUserAccountRootRef(ctx);
  const projDataRootRef = getUserDataRootRef(ctx);
  const oldChildRef = projDataRootRef.child(oldUid);
  // copy the data from old -> new user
  oldChildRef.once('value', (snap) => {
    projDataRootRef.child(newUid)
      .set(snap.val(), (error) => {
      // save this new user
        saveUserAccountDataAndSetUser(ctx, newUser);
      });
    oldChildRef.remove();
    userDataRootRef.child(oldUid)
      .remove();
  });
}
/** check to see if there is any pre-existing data when user changes signin state from
 * auth -> signed in
 */
function dealWithUserDataMigration(ctx, user) {
  // The signed-in user info.
  const newUser = authStateObject.newUser;
  const oldUid = authStateObject.oldUid;
  const newUid = authStateObject.newUid;
  if (LOGGING_ENABLED) {
    console.log(`dealWithUserDataMigration(): FROM oldUid=${oldUid} TO newUid=${newUid}`);
  }
  // check to see if new user or existing user
  const projDataRootRef = getUserDataRootRef(ctx);
  const newChildRef = projDataRootRef.child(newUid);
  newChildRef.once('value', (snap) => {
    if (!lodash.isNil(snap) && !lodash.isNil(snap.val())) {
    // anon->existing user
      if (LOGGING_ENABLED) {
        console.log('anon->existing user');
      }
      migrateUserAnonToExisting(ctx, oldUid, newUser);
    } else {
    // anon->new user
      if (LOGGING_ENABLED) {
        console.log('anon->brand new user');
      }
      migrateUserAnonToNew(ctx, oldUid, newUid, newUser);
    }
  });
}
/**
 * actually process the auth state change from firebase
 */
function processAuthStateChange(ctx, user) {
  if (lodash.isNil(authStateObject.oldUid) && lodash.isNil(authStateObject.newUid)) {
    // signed-in user is being logged in ...
    saveUserAccountDataAndSetUser(ctx, user);
  } else {
    // anon -> new / existing user needs to be taken care of ...
    dealWithUserDataMigration(ctx, user);
  }
  // reset the authStateObject!
  authStateObject = {};
}

/** perform anonymous sign in using firebase ... this is done by default */
function forceAnonSignIn(ctx) {
  ctx.getFirebase()
    .auth()
    .signInAnonymously()
    .catch((error) => {
      if (LOGGING_ENABLED) {
        console.log('anonSignIn(): problem signing in');
        console.dir(error);
      }
    });
}

// exported functions
const persistence = {};
  /**
   * setup firebase auth ... the onAuthStateChanged() method is the main method that
   * firebase uses to manage authentication
   * @param ctx
   */
persistence.initAuth = (ctx) => {
  // setup auth
  ctx.getFirebase()
    .auth()
    .onAuthStateChanged((user) => {
      if (user) {
      // user is signed in
        if (LOGGING_ENABLED) {
          console.log(`onAuthStateChanged: user is signed in: isAnonymous=${user.isAnonymous}, uid:${user.uid}`);
        }
        processAuthStateChange(ctx, user);
      } else {
        // user is signed out
        if (LOGGING_ENABLED) {
          console.log('onAuthStateChanged: user is signed out');
        }
        forceAnonSignIn(ctx);
      }
    });
};

/**
 * this is called when the user initiates Google signin. this is just called just once,
 * while the user is signed out or is an anonymous user (and the UI action is called).
 * subsequently this does not get called. the user is already auth'd ... it's handled
 * via the regular callback (onAuthStateChanged).
 * @param ctx
 * more info:
 * - google signin scopes - https://developers.google.com/identity/protocols/googlescopes
 * - firebase google provider - https://firebase.google.com/docs/auth/web/google-signin
 * - update firebase key - http://stackoverflow.com/questions/29115990/firebase-update-key
 */
persistence.forceSignIn = (ctx) => {
  const provider = new ctx.firebase.auth.GoogleAuthProvider();
  provider.addScope('profile');
  provider.addScope('email');
  ctx.getFirebase()
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const token = result.credential.accessToken;
      // The signed-in user info.
      const newUser = result.user;
      newUser.googleAccessToken = token;
      const oldUid = ctx.getUserId();
      const newUid = newUser.uid;
      authStateObject = {
        old_user: ctx.getUser(),
        newUser: newUser,
        oldUid: ctx.getUserId(),
        newUid: newUser.uid,
      };
    })
      .catch((error) => {
      // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        const credential = error.credential;
        if (LOGGING_ENABLED) {
          console.log('forceSignIn(): problem signing in');
          console.dir(error);
        }
      });
};


/** initiate sign out, called by the UI */
persistence.forceSignOut = (ctx) => {
  ctx.getFirebase()
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
      ctx.getReduxStore()
        .dispatch(actions.actionInit());
    }, (error) => {
    // An error happened.
    });
};


persistence.dispatchActionAndSaveStateToFirebase = (origAction, ctx) => {
  const action = origAction;
  // apply the action locally, and this will change the state
  ctx.getReduxStore()
      .dispatch(action);
  // save to persistence
  let rootRef = getUserDataRootRef(ctx, ctx.getUserId());
  let value = ctx.getReduxState().data;
  value[DB_CONST.SESSION_ID] = ctx.getSessionId();
  value[DB_CONST.TIMESTAMP] = ctx.getFirebaseServerTimestampObject();
  rootRef.child(DB_CONST.DATA_KEY)
        .set(value);
};

/** export public functions */
export default persistence;
