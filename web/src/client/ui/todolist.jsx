// @flow
// HyperSprite-TODO - More flow typing: 1 error
import React, {Component, PropTypes} from 'react';
import {isNil} from 'lodash';
import {List} from 'material-ui';

import TodoListItem from './todolist-todoitem';

/**
 * this renders the list of todoItems using the data in the LE_SET_DATA event.
 *
 * more info - http://stackoverflow.com/questions/22876978/loop-inside-react-jsx
 *
 * Props that are passed to it: n/a
 * State that it manages: n/a
 */

const propTypes = {
  todoArray: PropTypes.array,
  actionToggleTodoIndex: PropTypes.func,
};

export default class TodoList extends Component {
  
  constructor(props, context) {
    super(props, context);
  }
  
  componentDidMount() {
    this.scrollToBottom();
  }
  
  componentDidUpdate() {
    this.scrollToBottom();
  }
  
  scrollToBottom() {
    setTimeout(
      () => {
        const div = document.getElementById('scroll_todolist');
        div.scrollTop = div.scrollHeight - div.clientHeight;
        div.animate({scrollTop: div.scrollHeight});
      }, 0
    );
  }
  
  render() {
    const {
      todoArray,
      actionToggleTodoIndex,
    } = this.props;
    
    let jsxElements = [];
    
    if (!isNil(todoArray)) {
      jsxElements = todoArray.map(
        (todoItem, index) =>
          (
            <TodoListItem
              key={index}
              index={index}
              todoItem={todoItem}
              actionToggleTodoIndex={actionToggleTodoIndex}
            />
          )
      );
    }
    
    return (
      <List className="todolist">{jsxElements}</List>
    );
  }
}

TodoList.propTypes = propTypes;
