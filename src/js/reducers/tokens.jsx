import TYPES from '../actions/types'
import Devcon2TokenIDs from '../../fixtures/devcon2_token_ids'
import _ from 'lodash'

var initialState = {
  tokenIds: [..._.slice(Devcon2TokenIDs, 15)],  // TODO: remove slice
  tokenDetails: {},
  tokenMeta: null,
  upgradeData: {},
};

export default function(state, action) {
  if (state === undefined) {
    return initialState;
  }

  var newState = state;

  switch (action.type) {
    case TYPES.SET_TOKEN_DATA:
      console.log('SETTING TOKEN DATA');
      newState = _.merge(
        {},
        newState,
        {tokenDetails: {[action.tokenId]: action.tokenData}},
      )
      break;
    case TYPES.SET_TOKEN_META:
      console.log('SETTING TOKEN META');
      newState = _.merge(
        {},
        newState,
        {tokenMeta: action.tokenMeta},
      )
      break;
    case TYPES.SET_TOKEN_UPGRADE_TARGET:
      console.log('SETTING TOKEN UPGRADE TARGET');
      newState = _.merge(
        {},
        newState,
        {upgradeData: {[action.tokenId]: {target: action.target}}}
      );
      break;
    case TYPES.SET_TOKEN_UPGRADE_DATA_HASH:
      console.log('SETTING TOKEN UPGRADE DATA HASH');
      newState = _.merge(
        {},
        newState,
        {upgradeData: {[action.tokenId]: {dataHash: action.dataHash}}}
      );
      break;
    case TYPES.SET_TOKEN_UPGRADE_SIGNATURE:
      console.log('SETTING TOKEN UPGRADE SIGNATURE');
      newState = _.merge(
        {},
        newState,
        {upgradeData: {[action.tokenId]: {
          signedBytes: action.signedBytes,
          signature: action.signature,
        }}}
      );
      break;
    case TYPES.SET_TOKEN_UPGRADE_TRANSACTION_HASH:
      console.log('SETTING TOKEN UPGRADE TRANSACTION HASH');
      newState = _.mergeWith(
        {},
        [
          newState,
          {upgradeData: {[action.tokenId]: {
            transactionHashes: [action.transactionHash],
          }}}
        ],
        function(objValue, srcValue) {
          if (_.isArray(objValue)) {
            return objValue.concat(srcValue);
          }
        },
      );
      break;
  }

  return newState;
}
