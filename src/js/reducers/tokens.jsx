import TYPES from '../actions/types'
import { getAllTokenIds } from '../services/tokens'
import Devcon2TokenIDs from '../../fixtures/devcon2_token_ids'

var initialState = {
  tokenIds: [...Devcon2TokenIDs],
  tokens: {},
  tokenMeta: null,
};

export default function(state, action) {
  if (state === undefined) {
    return initialState;
  }

  var newState = state;

  switch (action.type) {
    case TYPES.SET_TOKEN_DATA:
      console.log('SETTING TOKEN DATA');
      newState = Object.assign({}, newState, {
        tokens: Object.assign(
          {},
          newState.tokens,
          {[action.tokenId]: action.tokenData},
        ),
      });
      break;
    case TYPES.SET_TOKEN_META:
      console.log('SETTING TOKEN META');
      newState = Object.assign({}, newState, {
        tokenMeta: Object.assign({}, newState.tokenMeta || {}, action.tokenMeta),
      });
      break;
  }

  return newState;
}
