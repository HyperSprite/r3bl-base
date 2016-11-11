// @flow
// HyperSprite-TODO - More flow typing: 12 errors
import React, {Component} from 'react';
import lodash from 'lodash';
import {Paper, List} from 'material-ui';
import {applicationContext} from '../container/context';
import {GLOBAL_CONSTANTS} from '../../global/constants';
import GCMessageItem from './groupchat-messageitem';

const propTypes = {};
type Props = any;

export default class GroupChat extends Component {
  
  constructor(props: Props, context: {}) {
    super(props, context);
    this.state = {chatMessageList: []};
  }
  
  componentDidMount() {
    this.scrollToBottom();
    // respond to chat messages coming in from the server socket
    const socket = applicationContext.getSocket();
    socket.on(
      GLOBAL_CONSTANTS.REMOTE_MESSAGE_FROM_SERVER, (data) => {
        this.rcvMsgFromServer(data);
      }
    );
    // respond to changes in presence
    applicationContext.addListener(
      GLOBAL_CONSTANTS.LE_PRESENCE_USER_ADDED, (presence) => {
        const msg: ChatMessageIF = {
          message: `${presence.user.displayName} joined`,
          displayName: 'The App',
          photoURL: 'assets/favicon.png',
          timestamp: new Date().getTime(),
        };
        this.rcvMsgFromServer(msg);
      }
    );
    applicationContext.addListener(
      GLOBAL_CONSTANTS.LE_PRESENCE_USER_REMOVED, (presence) => {
        const msg: ChatMessageIF = {
          message: `${presence.user.displayName} left`,
          displayName: 'The App',
          photoURL: 'assets/favicon.png',
          timestamp: new Date().getTime(),
        };
        this.rcvMsgFromServer(msg);
      }
    );
    applicationContext.addListener(
      GLOBAL_CONSTANTS.LE_PRESENCE_USER_CHANGED, (presence) => {
        const msg: ChatMessageIF = {
          message: `${presence.user.displayName} is ${presence.status}`,
          displayName: 'The App',
          photoURL: 'assets/favicon.png',
          timestamp: new Date().getTime(),
        };
        this.rcvMsgFromServer(msg);
      }
    );
  }
  
  componentDidUpdate() {
    this.scrollToBottom();
  }
  
  scrollToBottom() {
    setTimeout(
      () => {
        const div = document.getElementById('scroll_chatlist');
        div.scrollTop = div.scrollHeight - div.clientHeight;
        div.animate({scrollTop: div.scrollHeight});
      }, 0
    );
  }
  
  rcvMsgFromServer(data: ChatMessageIF) {
    const {chatMessageList} = this.state;
    const copy = lodash.clone(chatMessageList);
    copy.push(data);
    this.setState({chatMessageList: copy});
  }
  
  renderMessageList(chatMessageList: Array<ChatMessageIF>) {
    const jsxElements = [];
    const avatarIconSize: number = 32;
    if (!lodash.isNil(chatMessageList)) {
      chatMessageList.forEach(
        (chatMessage, index) => {
          jsxElements.push(
            <GCMessageItem
              key={index}
              index={index}
              chatMessage={chatMessage}
              avatarIconSize={avatarIconSize}
            />
          );
        }
      );
    }
    return (<List className="todolist">{jsxElements}</List>);
  }
  
  renderEmptyMsg(style: GCMessageStyleIF) {
    return (
      <div>
        <Paper zDepth={3} style={style}>
          There are no messages right now. Please type a message below.
        </Paper>
      </div>
    );
  }
  
  render() {
    const style: GCMessageStyleIF = {
      height: '50pt',
      width: '95%',
      margin: 20,
      padding: 20,
      textAlign: 'center',
      display: 'inline-block',
    };
    
    const {chatMessageList} = this.state;
    if (chatMessageList.length === 0) {
      return this.renderEmptyMsg(style);
    }
    return this.renderMessageList(chatMessageList);
  }
}

GroupChat.propTypes = propTypes;
