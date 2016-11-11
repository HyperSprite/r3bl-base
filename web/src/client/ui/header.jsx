// @flow
// HyperSprite-TODO - More flow typing: 1 error
/**
 * Created by nazmul on 9/2/16.
 */

import React, {Component, PropTypes} from 'react';
import lodash from 'lodash';
import {AppBar, Avatar, IconButton} from 'material-ui';
import ActionAccountCircle from 'material-ui/svg-icons/action/account-circle';

import {GLOBAL_CONSTANTS} from '../../global/constants';
import {applicationContext} from '../container/context';

/**
 * material UI icons
 * google material icons site - https://design.google.com/icons/
 *
 * To construct an icon, find it in the google site. Then transform the name.
 * Eg: search for cloud, you will find "cloud download" in the "file" category ...
 *
 * so the React component class is: [File][CloudDownload]
 * so the import is: material-ui/svg-icons/[file]/[cloud-download]
 *
 * this class holds the app bar and the login button
 * Props that are passed to it: n/a
 * State that it manages: n/a
 * Context that is requires: app
 */

// const propTypes = {
//   user: PropTypes.object,
// };

export default class Header extends Component {
  
  constructor(props, context) {
    super(props, context);
  }
  
  loginAction() {
    // get the App object from the React context
    const app = this.context.app;
    
    if (applicationContext.isUserSet()) {
      if (applicationContext.getUser().isAnonymous) {
        // go from anonauth->signedinauth
        app.showSnackBar('anonauth->signedinauth');
        applicationContext.forceSignIn();
      } else {
        // logout
        app.showSnackBar('logout');
        applicationContext.forceSignOut();
      }
    } else {
      // do nothing .. user must be set!
      app.showSnackBar('should never happen -> user must be set');
    }
  }
  
  render() {
    const {user} = this.props;
    
    // depending on whether the user is signed in or not, provide different appbar
    let titleString = 'Todo List Sample App';
    
    const avatarIconSize = 32;
    const customPadding = {
      padding: 8,
    };
    
    // depending on whether the user is signed in or not, provide different appbar
    let srcPhotoURL = null;
    let iconAction = null;
    
    if (applicationContext.isUserSet() && !applicationContext.getUser().isAnonymous) {
      // SIGNEDIN
      srcPhotoURL = applicationContext.getUser().photoURL || null;
      titleString += ` for ${user.displayName}`;
    } else {
      iconAction = <ActionAccountCircle /> || null;
    }
    
    return (
      <AppBar
        className="appbar_in_main"
        title={titleString}
        iconElementRight={
          <IconButton
            style={customPadding}
            onTouchTap={::this.loginAction}
          >
            <Avatar
              size={avatarIconSize}
              src={srcPhotoURL}
              icon={iconAction}
            />
          </IconButton>
        }
      />
    );
  } // end render()
  
  /** tell react that we have this object in the context ... note static keyword */
  static contextTypes = {
    app: React.PropTypes.object.isRequired,
  }
  
}// end class Header

// export default Header;

// Header.propTypes = propTypes;
