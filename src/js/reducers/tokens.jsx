import TYPES from '../actions/types'
import Devcon2TokenIDs from '../../fixtures/devcon2_token_ids'
import _ from 'lodash'

var initialState = {
  contractCode: null,
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
    case TYPES.SET_TOKEN_CONTRACT_CODE:
      newState = _.merge(
        {},
        newState,
        {contractCode: action.contractCode}
      )
      break;
    case TYPES.SET_TOKEN_DATA:
      newState = _.merge(
        {},
        newState,
        {tokenDetails: {[action.tokenId]: action.tokenData}},
      )
      break;
    case TYPES.SET_TOKEN_META:
      newState = _.merge(
        {},
        newState,
        {tokenMeta: action.tokenMeta},
      )
      break;
    case TYPES.SET_TOKEN_UPGRADE_PARAMETERS:
      newState = _.merge(
        {},
        newState,
        {upgradeData: {[action.tokenId]: {upgradeParameters: action.upgradeParameters}}}
      );
      break;
    case TYPES.SET_TOKEN_UPGRADE_SIGNATURE:
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
      newState = _.mergeWith(
        {},
        [
          newState,
          {upgradeData: {[action.tokenId]: {
            transactionHashes: [action.transactionHash],
          }}}
        ],
        function(objValue, srcValue) {
          if (_.isArray(objValue) && _.isArray(srcValue)) {
            return _.uniq(_.concat([], objValue, srcValue))
          }
        },
      );
      break;
  }

  return newState;
}
