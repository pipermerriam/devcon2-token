import React from 'react'
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider, connect } from 'react-redux';

import reducer from '../reducers/index';
import App from './app';

function createReduxStore() {
  let store = createStore(
    reducer,
    applyMiddleware(thunk),
  )
  return store;
}

export default React.createClass({
  render() {
    return (
      <Provider store={createReduxStore()}>
        <App />
      </Provider>
    );
  }
});
