#Example JSX Files

JSX files are just JS files with JSX in them. A simple example of a JSX file can be found in this directory called **groupchat-messageitem.jsx**.  For more, see [JSX in depth](https://facebook.github.io/react/docs/jsx-in-depth.html).

This README shows the layout for these files.
##Add Flow
Flow only checks files you specify as typed. To do this, add  ```// @flow``` to the top of the file. See [Flow](https://flowtype.org/) for more.
##Layout of imports 
Import all modules first. These are imports that don't have relative paths. Try to keep the order the same from file to file. Only use ```import```, do not use ```require```. It might look something like this:
```js
import React, { Component, PropTypes } from 'react';
import lodash from 'lodash';
import { Paper, List } from 'material-ui';
import { applicationContext } from '../container/context';
import { GLOBAL_CONSTANTS } from '../../global/constants';
import GCMessageItem from './groupchat-messageitem';
```
>Note: Use single quotes ```' '``` for strings. Use back ticks ``` ` ` ``` for template strings. Rule of thumb, if nothing in the string has a placeholder, use single quotes, if it does, use back ticks. See [Template Literals on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) for more.

The first line is a good example of what we can do here. 
```import React, { Component, PropTypes } from 'react';```
We are importing all of ```React```, we are pulling ```Component``` and ```PropTypes``` out as their own variables so we can use them directly without saying ```React.Component```. For more see [Import on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import).

##PropTypes
We want to declare PropTypes values at the top so they are easy to find and refer to without scrolling all the way to the bottom. We create a variable for that just below the imports. For more see [React PropTypes](https://facebook.github.io/react/docs/typechecking-with-proptypes.html).

>Note: PropTypes are runtime type checking. They are not the same as Flow Types which is staticly typed.
```js
const propTypes = {
  chatMessage: PropTypes.object,
  avatarIconSize: PropTypes.number,
  photoURL: PropTypes.string,
};
``` 

Then at the end of the file we add the following where ```GCMessageItem``` is the function or class you will be exporting.
```js
// last line of code in the file
GCMessageItem.propTypes = propTypes;
```

##Exported function or class
Each file should contain a single export. If you need more exports, you should break them out into more files.

```js
export default function GCMessageItem(props: GCMessageItemIF) {
  function displayMsg(chatMessage) {
    return `${chatMessage.displayName} says: ${chatMessage.message}`;
  }

  return (
    <ListItem
      primaryText={displayMsg(props.chatMessage)}
      rightIcon={
        <Avatar
          size={props.avatarIconSize}
          src={props.chatMessage.photoURL}
        />}
    />
  );
}
```
###Dissecting the above function
We are using a function because it does not have its own internal state or care about lifecycle methods. Props are passed in and a component is returned using a pure function. 
Export your function on the line where you define it:
```js
export default function GCMessageItem(....
```
Define your Flow types, ```GCMessageItemIF``` can be found in **flow-typed/interface.js** file:
```js
(props: GCMessageItemIF)
```
Add any functionality above the ```return``` stanza:
```js
  function displayMsg(chatMessage) {
    return `${chatMessage.displayName} says: ${chatMessage.message}`;
  }
```
####The return
Always return.
If the return is multiple lines, they should be surrounded by parens ```()```.
Put each property on its own line.
Use double-quotes ```" "``` for surrounding strings.

###Other Notes:
**Props default to true**:
If you have a prop, like ```fullWidth={true}```, you can omit the ```={true}``` and just type ```fullWidth```. This can look a little odd at first but it does save a bit of typing.

**Don't bind ```this``` inside of JSX**
Binding ```this``` inside of JSX will cause a new binding every time that component is called. This may not be an issue when you only have a few components but imagine calling hundreds of list items, and binding all of them, this can cause a performance issues. Instead, bind these in the constructor like so:
```this.onKeyPress = this.onKeyPress.bind(this);```
Yes it seems redundant, and there are some proposals for fixing this in future versions of React but until then, this works well and seems quite clear.
