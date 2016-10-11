import TYPES from '../actions/types'
import { getAllTokenIDs } from '../services/tokens'

var initialState = {
  tokenIds: [],
  tokens: {},
  loaded: false,
};

export default function(state, action) {
  if (state === undefined) {
    return initialState;
  }

  var newState = state;

  switch (action.type) {
    case TYPES.LOAD_TOKENS:
      console.log('LOADING TOKENS');
      newState = Object.assign({}, newState, {loaded: true});
      break;
    case TYPES.SET_TOKEN:
      console.log('SETTING TOKEN');
      newState = Object.assign({}, newState, {
        tokenIds: _.chain(newState.tokenIds).union([action.token]).uniq().value(),
      });
      break;
    case TYPES.SET_TOKEN_DATA:
      console.log('SETTING TOKEN DATA');
      console.log(action.tokenId);
      console.log(action.tokenData);
      newState = Object.assign({}, newState, {
        tokens: Object.assign({}, newState.tokens, {[action.tokenId]: action.tokenData}),
      });
      break;
  }

  return newState;
}
