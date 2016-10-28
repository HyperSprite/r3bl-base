import React, { PropTypes } from 'react';
import { ListItem, Avatar } from 'material-ui';

const propTypes = {
  chatMessage: PropTypes.object,
  avatarIconSize: PropTypes.number,
  photoURL: PropTypes.string,
};

// class ChatMessageListItem extends React.Component<Props, {}> {
export default function ChatMessageListItem(props) {
  function displayMsg(chatMessage) {
    return `${chatMessage.displayName} says: ${chatMessage.message}`;
  }

  return (
    <ListItem
      primaryText={displayMsg(props.chatMessage)}
      rightIcon={<Avatar size={props.avatarIconSize} src={props.photoURL} />}
    />
  );
}

ChatMessageListItem.propTypes = propTypes;

// class ChatMessageListItem extends React.Component {
//   render() {
//       const chatMessage = this.props.chatMessage;
//       const avatar_icon_size = 32;
//       const displayMsg = `${chatMessage.displayName} says: ${chatMessage.message}`;
//       return (<ListItem primaryText={displayMsg} rightIcon={<Avatar size={avatar_icon_size} src={chatMessage.photoURL}/>}/>);
//   }
// }
