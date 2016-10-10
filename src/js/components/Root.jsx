import React from 'react'
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';

import reducer from '../reducers/index';
import App from './app';

function createReduxStore() {
  let store = createStore(reducer)
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
