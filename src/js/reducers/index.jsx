import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'

import tokens from './tokens'
import addresses from './addresses'
import pagination from './pagination'
import web3 from './web3'


export default combineReducers({
  tokens,
  pagination,
  web3,
  addresses,
  routing: routerReducer,
  form: formReducer,
})
