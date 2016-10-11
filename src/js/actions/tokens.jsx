import TYPES from './types'
import { getAllTokenIDs, getTokenData } from '../services/tokens'


export function loadTokens() {
  return function(dispatch, getState) {
    var filter = getAllTokenIDs();
    filter.watch(function(err, result) {
      if (!err) {
        var state = getState().tokens;
        if (state.tokenIds.length > 10) {
          filter.stopWatching();
        }
        dispatch(setToken(result.args._id));
      } else {
        filter.stopWatching();
        console.error(err);
      }
    });
  }
}

export function setToken(token) {
  return {
    type: TYPES.SET_TOKEN,
    token: token,
  };
}


export function loadTokenData(tokenId) {
  return function(dispatch, getState) {
    getTokenData(tokenId).then(function(result) {
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
