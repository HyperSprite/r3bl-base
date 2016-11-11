// @flow
// HyperSprite-TODO - More flow typing: 1 error
/**
 * these functions handle dealing presence state with firebase
 */
import lodash from 'lodash';
import IdleJs from 'idle-js';

import {GLOBAL_CONSTANTS, LOGGING_ENABLED} from '../../global/constants';
import * as actions from './actions';

const PRESENCE_STATES = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  IDLE: 'idle',
  AWAY: 'away',
};

const DB_CONST = {
  CONNECTED: '.info/connected',
  USER_LIST_ROOT: 'USERS_ONLINE',
};
let currentStatus: string;
let myUserRef: any;

function setUserStatus(status, ctx) {
  // Set our status in the list of online users.
  currentStatus = status;
  if (ctx.isUserSet() && !ctx.getUser().isAnonymous) {
    // user must be signed in ...
    const presenceObject = {
      status,  // ES6 object literal shorthand == status: status,
      user: ctx.getUser(),
    };
    // this works even when the myUserRef is removed onDisconnect()
    // set will just recreate a new object at the root level with the
    // old key!
    myUserRef.set(presenceObject);
  }
}
function getConnectedStateRef(ctx) {
  return ctx.getDatabase()
            .ref(DB_CONST.CONNECTED);
}
function getUserListRootRef(ctx) {
  return ctx.getDatabase()
            .ref(DB_CONST.USER_LIST_ROOT);
}

function initPresence(ctx) {
  // Get a reference to the presence data in Firebase.
  const userListRef = getUserListRootRef(ctx);
  // Generate a reference to a new location for my user with push.
  myUserRef = userListRef.push();
  // Monitor connection state on browser tab
  getConnectedStateRef(ctx)
    .on(
      'value', (snap) => {
        if (snap.val()) {
          // If we lose our internet connection, we want ourselves removed from the list.
          myUserRef.onDisconnect()
                   .remove();
          // Set our initial online status.
          setUserStatus(PRESENCE_STATES.ONLINE, ctx);
          ctx.emit(GLOBAL_CONSTANTS.LE_CONTAINER_NETWORK_CONNECTION_STATE, PRESENCE_STATES.ONLINE);
        } else {
          // We need to catch anytime we are marked as offline and then set the correct
          // status. We could be marked as offline 1) on page load or 2) when we lose our
          // internet connection temporarily.
          setUserStatus(PRESENCE_STATES.OFFLINE, ctx);
          ctx.emit(GLOBAL_CONSTANTS.LE_CONTAINER_NETWORK_CONNECTION_STATE, PRESENCE_STATES.OFFLINE);
        }
      }
    );
  // respond to changes in user login (anon auth and signed in)
  ctx.addListener(
    GLOBAL_CONSTANTS.LE_SET_USER, (userObject: UserIF) => {
      setUserStatus(PRESENCE_STATES.ONLINE, ctx);
    }
  );
  // respond to changes in the browser activity
  // more info - https://github.com/soixantecircuits/idle-js
  
  new IdleJs(
    {
      idle: 10000,
      // events that will trigger the idle resetter
      events: ['mousemove', 'keydown', 'mousedown', 'touchstart'],
      // callback function to be executed after idle time
      onIdle() {
        setUserStatus(PRESENCE_STATES.IDLE, ctx);
      },
      // callback function to be executed after back form idleness
      onActive() {
        setUserStatus(PRESENCE_STATES.ONLINE, ctx);
      },
      // callback function to be executed when window become hidden
      onHide() {
        setUserStatus(PRESENCE_STATES.AWAY, ctx);
      },
      // callback function to be executed when window become visible
      onShow() {
        setUserStatus(PRESENCE_STATES.ONLINE, ctx);
      },
      keepTracking: true,
      startAtIdle: false, // set it to true if you want to start in the idle state
    }
  ).start();
  // Update our GUI to show someone's online status.
  userListRef.on(
    'child_added', (snap) => {
      const presence = snap.val();
      // console.log(`added ${JSON.stringify(presence)}`);
      ctx.emit(GLOBAL_CONSTANTS.LE_PRESENCE_USER_ADDED, presence);
    }
  );
  // Update our GUI to remove the status of a user who has left.
  userListRef.on(
    'child_removed', (snap) => {
      const presence = snap.val();
      // console.log(`removed ${JSON.stringify(presence)}`);
      ctx.emit(GLOBAL_CONSTANTS.LE_PRESENCE_USER_REMOVED, presence);
    }
  );
  // Update our GUI to change a user's status.
  userListRef.on(
    'child_changed', (snap) => {
      const presence = snap.val();
      // console.log(`changed ${JSON.stringify(presence)}`);
      ctx.emit(GLOBAL_CONSTANTS.LE_PRESENCE_USER_CHANGED, presence);
    }
  );
}

export default initPresence;
