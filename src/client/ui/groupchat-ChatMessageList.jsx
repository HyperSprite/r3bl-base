import React, { Component, PropTypes } from 'react';
import lodash from 'lodash';
import {
  Paper,
  List,
} from 'material-ui';
import GLOBAL_CONSTANTS from '../../global/constants';
import { applicationContext } from '../container/context';
import MessageListItem from './groupchat-ChatMessageListItem';
// import { ChatMessageIF, PresenceIF} from "../container/interfaces";
// import Props = __React.Props;

const propTypes = {
  chatMessage: PropTypes.object,
};

// export class GroupChat extends React.Component<Props, {}> {
export default class GroupChat extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = { chatMessageList: [] };
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
      // GLOBAL_CONSTANTS.LE_PRESENCE_USER_ADDED, (presence: PresenceIF)=> {
      GLOBAL_CONSTANTS.LE_PRESENCE_USER_ADDED, (presence) => {
        // const msg: ChatMessageIF = {
        const msg = {
          message: `${presence.user.displayName} joined`,
          displayName: 'The App',
          photoURL: 'favicon.png',
          timestamp: new Date().getTime(),
        };
        this.rcvMsgFromServer(msg);
      }
    );

    applicationContext.addListener(
      // GLOBAL_CONSTANTS.LE_PRESENCE_USER_REMOVED, (presence: PresenceIF)=> {
      GLOBAL_CONSTANTS.LE_PRESENCE_USER_REMOVED, (presence) => {
        // const msg: ChatMessageIF = {
        const msg = {
          message: `${presence.user.displayName} left`,
          displayName: 'The App',
          photoURL: 'assets/favicon.png',
          timestamp: new Date().getTime(),
        };
        this.rcvMsgFromServer(msg);
      }
    );

    applicationContext.addListener(
      // GLOBAL_CONSTANTS.LE_PRESENCE_USER_CHANGED, (presence: PresenceIF)=> {
      GLOBAL_CONSTANTS.LE_PRESENCE_USER_CHANGED, (presence) => {
        // const msg: ChatMessageIF = {
        const msg = {
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
    setTimeout(() => {
      this.div = document.getElementById('scroll_chatlist');
      this.div.scrollTop = this.div.scrollHeight - this.div.clientHeight;
      this.div.animate({ scrollTop: this.div.scrollHeight });
    });
  }

  // rcvMsgFromServer(data: ChatMessageIF) {
  rcvMsgFromServer(data) {
    const { chatMessageList } = this.state;
    const copy = lodash.clone(chatMessageList);
    copy.push(data);
    this.setState({ chatMessageList: copy });
  }

// const chatMessage: ChatMessageIF = this.props.chatMessage;
  renderMessageList(chatMessageList) {
    if (!lodash.isNil(chatMessageList)) {
      return (
        <List className="todolist">
          {
            chatMessageList.forEach(
              (chatMessage, index) => (
                <MessageListItem
                  key={index}
                  index={index}
                  chatMessage={chatMessage}
                  avatarIconSize="32"
                />
              )
            )
          }
        </List>
      );
    }
    return null;
  }

  // _renderEmptyMsg(style: {height: string; width: string; margin: number; padding: number; textAlign: string; display: string}) {
  renderEmptyMsg(style) {
    return (
      <div>
        <Paper zDepth={3} style={style}>
          There are no messages right now. Please type a message below.
        </Paper>
      </div>
    );
  }

  render() {
    const style = {
      height: '50pt',
      width: '95%',
      margin: 20,
      padding: 20,
      textAlign: 'center',
      display: 'inline-block',
    };

    const { chatMessageList } = this.state;

    if (chatMessageList.length === 0) {
      return this.renderEmptyMsg(style);
    }
    return this.renderMessageList(chatMessageList);
  }
}

GroupChat.propTypes = propTypes;
