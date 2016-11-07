import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import { Router, Route, Link, IndexRoute, browserHistory } from 'react-router'
import { Provider, connect } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import thunk from 'redux-thunk'

import reducer from '../reducers/index'
import App from './app'
import Devcon2TokenIndex from './Devcon2TokenIndex'
import Devcon2TokenExplorer from './Devcon2TokenExplorer'
import Devcon2TokenDetail from './Devcon2TokenDetail'
import Devcon2TokenUpgrade from './Devcon2TokenUpgrade'
import AddressDetail from './AddressDetail'


function createReduxStore() {
  let store = createStore(
    reducer,
    applyMiddleware(thunk),
  )
  return store
}

export default React.createClass({
  render() {
    var store = createReduxStore()
    const history = syncHistoryWithStore(browserHistory, store)
    return (
      <Provider store={store}>
        <Router history={history}>
          <Route path='/' component={App}>
            <IndexRoute component={Devcon2TokenIndex} />
            <Route path="tokens" component={Devcon2TokenExplorer} />
            <Route path="tokens/:id" component={Devcon2TokenDetail} />
            <Route path="tokens/:id/upgrade" component={Devcon2TokenUpgrade} />
            <Route path="addresses/:address" component={AddressDetail} />
          </Route>
        </Router>
      </Provider>
    )
  }
})
