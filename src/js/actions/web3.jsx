import TYPES from './types'
import { getWeb3Options, getDefaultWeb3, getWeb3 } from '../services/web3'

export function initializeWeb3() {
  return function(dispatch, getState) {
    return Promise.all([
      getWeb3Options(),
      getDefaultWeb3(),
    ]).then(function(results) {
      dispatch(setWeb3Options(results[0]));
      dispatch(selectWeb3(results[1]));
    });
  };
}

export function selectWeb3(choice) {
  return function(dispatch, getState) {
    getWeb3(choice).then(function(web3) {
      dispatch(setWeb3Selection(choice));
      dispatch(setWeb3(web3));
    }, function(error) {
      console.error(error);
    })
  };
}

export function setWeb3Options(options) {
  return {
    type: TYPES.SET_WEB3_OPTIONS,
    options: options,
  };
}

export function setWeb3Selection(selection) {
  return {
    type: TYPES.SET_WEB3_SELECTION,
    selection: selection,
  }
}

export function setWeb3(web3) {
  return {
    type: TYPES.SET_WEB3,
    web3: web3,
  }
}
