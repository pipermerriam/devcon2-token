import TYPES from './types'
import { getAllTokenIds, getTokenData } from '../services/tokens'


export function loadTokenData(tokenId) {
  return function(dispatch, getState) {
    var state = getState();
    if (state.web3.web3 === undefined) {
      debugger;
    }
    getTokenData(tokenId, state.web3.web3).then(function(result) {
      dispatch(setTokenData(tokenId, result));
    }, function(error) {
      console.error(error);
    });
  };
}

export function setTokenData(tokenId, tokenData) {
  return {
    type: TYPES.SET_TOKEN_DATA,
    tokenId: tokenId,
    tokenData: tokenData,
  };
}
