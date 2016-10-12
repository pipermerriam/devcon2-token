import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import tokens from './tokens'
import pagination from './pagination'
import web3 from './web3'


export default combineReducers({
  tokens,
  pagination,
  web3,
  routing: routerReducer,
})
