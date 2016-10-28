import React, { PropTypes } from 'react';
import { ListItem, Avatar } from 'material-ui';

const propTypes = {
  displayMsg: PropTypes.string,
  avatarIconSize: PropTypes.number,
  photoURL: PropTypes.string,
};

// class ChatMessageListItem extends React.Component<Props, {}> {
export default function ChatMessageListItem(props) {
  return (
    <ListItem
      primaryText={props.displayMsg}
      rightIcon={<Avatar size={props.avatarIconSize} src={props.photoURL} />}
    />
  );
}

ChatMessageListItem.propTypes = propTypes;
