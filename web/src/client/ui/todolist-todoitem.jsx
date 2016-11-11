// @flow
// HyperSprite-TODO - More flow typing: 1 error
import React, {Component, PropTypes} from 'react';
import {ListItem} from 'material-ui';
import CheckBox from 'material-ui/svg-icons/toggle/check-box';
import CheckBoxOutlineBlank from 'material-ui/svg-icons/toggle/check-box-outline-blank';
/**
 * this is a simple component which renders a single todoItem based on the props
 *
 * Props that are passed to it: todoItem
 * State that it manages: n/a
 */

const propTypes = {
  index: PropTypes.number,
  actionToggleTodoIndex: PropTypes.func,
  todoItem: PropTypes.object,
  // onClick: PropTypes.func,
};

export default class TodoItem extends Component {
  
  // props: Props;
  
  constructor(...props: Array<void>) {
    super(...props);
    this.onClick = this.onClick.bind(this);
  }
  
  onClick() {
    const {index, actionToggleTodoIndex} = this.props;
    actionToggleTodoIndex(index);
  }
  
  
  render() {
    const todoItem = this.props.todoItem;
    const done = todoItem.done;
    const text = todoItem.item;
    const doneState = done ?
      <CheckBox /> :
      <CheckBoxOutlineBlank />;
    
    return (
      <ListItem
        primaryText={text}
        onClick={this.onClick}
        rightIcon={doneState}
      />
    );
  }
}

TodoItem.propTypes = propTypes;
