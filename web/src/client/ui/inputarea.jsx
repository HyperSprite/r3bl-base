// @flow
// HyperSprite-TODO - More flow typing: 1 error
import React, { Component, PropTypes } from 'react';
import lodash from 'lodash';
import { TextField } from 'material-ui';

import { GLOBAL_CONSTANTS } from '../../global/constants';
import { applicationContext } from '../container/context';

const propTypes = {
  user: PropTypes.object,
  type: PropTypes.string,
  actionAddTodoText: PropTypes.func,
};

/**
 * this is a simple component that allows the user to type a new todoitem (and emits
 * an event LE_ADD_TODO_ITEM. it also listens to changes in the LE_SET_USER event.
 *
 * more info
 *   - https://blog.iansinnott.com/managing-state-and-controlled-form-fields-with-react/
 *   - https://facebook.github.io/react/docs/events.html#keyboard-events
 *   - pressing enter key & onChange - http://goo.gl/hZAbTk
 *   - https://nodesource.com/blog/understanding-socketio/
 *
 * Props that are passed to it: n/a
 * State that it manages: n/a
 * Context that is requires: app
 *
 * more info
 * - http://reactkungfu.com/2016/01/react-context-feature-in-practice/
 */
export default class InputArea extends Component {

  /** tell react that we have this object in the context ... note static keyword */
  static contextTypes = {
    app: React.PropTypes.object.isRequired,
  }

  constructor(props: {}, context: any) {
    super(props, context);
    this.state = { inputValue: '' };

    this.onChange = this.onChange.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  state: {
    inputValue: string;
  }

  /** used to check for ENTER key presses */
  onKeyPress(e) {
    // ENTER is pressed
    if (e.key === 'Enter') {
      // get user input
      const newval = e.target.value;

      // reset the text input field
      this.setState({ inputValue: '' });
      const { type, user } = this.props;
      const { app } = this.context;

      if (lodash.isEqual(type, 'todo')) {
        // call passed action to update redux!
        this.props.actionAddTodoText(newval);
      } else {
        // chat
        if (!lodash.isNil(user)) {
          if (!user.isAnonymous) {
            // user is signed in && not anonymous
            // emit this to the via the app
            // create a ChatMessageIF and send it
            const chatMessage = {
              message: newval,
              timeStamp: new Date().getTime(),
              displayName: user.displayName,
              photoURL: user.photoURL,
              sessionId: applicationContext.getSessionId(),
            };
            app.sndMsgToServer(chatMessage);
          } else {
            app.showSnackBar('Message not sent - you must be signed in to chat');
          }
        }
      }
    }
  }

  /** used to sync user input w/ component state */
  onChange(e) {
    this.setState({ inputValue: e.target.value });
  }

  render() {
    const { user, type } = this.props;
    const labeltextTodo = 'Add a todo';
    const labeltextChat = 'Write a group chat message';
    const labeltextCantChat = 'Must sign in to chat';
    let labeltext;
    let textFieldDisabled = false;

    if (lodash.isEqual(type, 'todo')) {
      labeltext = labeltextTodo;
      textFieldDisabled = false;
    } else {
      labeltext = labeltextCantChat;
      textFieldDisabled = true;
    }

    if (!lodash.isNil(user)) {
      if (!user.isAnonymous) {
        // user is signed in && not anonymous
        if (lodash.isEqual(type, 'todo')) {
          labeltext = `${labeltextTodo} ${user.displayName}`;
          textFieldDisabled = false;
        } else {
          labeltext = `${labeltextChat} ${user.displayName}`;
          textFieldDisabled = false;
        }
      }
    }

    const style = {
      height: 56,
      paddingLeft: 16,
      fontFamily: 'Roboto Mono',
    };

    return (
      <TextField
        style={style}
        hintText={labeltext}
        value={this.state.inputValue}
        disabled={textFieldDisabled}
        onChange={this.onChange}
        onKeyPress={this.onKeyPress}
        fullWidth
      />
    );
  }

}

// export default InputArea;

InputArea.propTypes = propTypes;
