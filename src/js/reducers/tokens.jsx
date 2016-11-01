import TYPES from '../actions/types'
import { getAllTokenIds } from '../services/tokens'
import Devcon2TokenIDs from '../../fixtures/devcon2_token_ids'
import _ from 'lodash'

var initialState = {
  tokenIds: [..._.slice(Devcon2TokenIDs, 15)],
  tokenDetails: {},
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
        tokenDetails: Object.assign(
          {},
          newState.tokenDetails,
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
