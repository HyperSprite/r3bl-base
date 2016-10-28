// @flow
import React, { PropTypes } from 'react';
import { ListItem, Avatar } from 'material-ui';

const propTypes = {
  chatMessage: PropTypes.object,
  avatarIconSize: PropTypes.number,
  photoURL: PropTypes.string,
};

// class ChatMessageListItem extends React.Component<Props, {}> {
export default function GCMeassageItem(props: GCMeassageItemIF) {
  function displayMsg(chatMessage) {
    return `${chatMessage.displayName} says: ${chatMessage.message}`;
  }

  return (
    <ListItem
      primaryText={displayMsg(props.chatMessage)}
      rightIcon={<Avatar size={props.avatarIconSize} src={props.chatMessage.photoURL} />}
    />
  );
}

GCMeassageItem.propTypes = propTypes;
