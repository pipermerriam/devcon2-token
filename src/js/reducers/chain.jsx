import _ from 'lodash'
import TYPES from '../actions/types'

var initialState = {
  metaData: {
    genesisBlockHash: null,
    isLoaded: false,
    isMainnet: null,
    isMorden: null,
  },
};

export default function(state, action) {
  if (state === undefined) {
    return initialState;
  }

  var newState = state;

  switch (action.type) {
    case TYPES.SET_CHAIN_METADATA:
      newState = _.merge(
        {},
        newState,
        {metaData: action.metaData},
      );
  }

  return newState;
}
