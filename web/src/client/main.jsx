 // @flow
 //
/**
 * this is the main entry point for the web app
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './ui/app';
import { applicationContext } from './container/context';

/** Material UI requirement */
import injectTapEventPlugin from 'react-tap-event-plugin';

/**
 * Material UI requirement
 * Needed for onTouchTap
 * more info - http://stackoverflow.com/a/34015469/988941
 */
injectTapEventPlugin();

ReactDOM.render(
  <Provider store={applicationContext.getReduxStore()}>
    <App />
  </Provider>,
  document.getElementById('app')
);
