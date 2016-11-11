import TYPES from '../actions/types'
import _ from 'lodash'

var initialState = {
  transactionDetails: {},
};

export default function(state, action) {
  if (state === undefined) {
    return initialState;
  }

  var newState = state;

  switch (action.type) {
    case TYPES.SET_TRANSACTION:
      newState = _.merge(
        {},
        newState,
        {transactionDetails: {[actions.transactionHash]: action.transactionDetails}}
      )
      break;
    case TYPES.REMOVE_TRANSACTION:
      newState = _.assign(
        {},
        newState,
        {transactionDetails: _.omit(newState.transactionDetails, [action.transactionHash])}
      )
      break;
  }

  return newState;
}
