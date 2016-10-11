import { combineReducers } from 'redux';
import tokens from './tokens';
import pagination from './pagination';
import web3 from './web3';


export default combineReducers({
  tokens,
  pagination,
  web3,
})
