import TYPES from '../actions/types'

var initialState = {
  config: null,
  selectedWeb3: null,
  status: {
    isConnected: null,
    timeoutID: null,
  },
  isBrowserAvailable: null,
  web3: null,
  accounts: null,
};

export default function(state, action) {
  if (state === undefined) {
    return initialState;
  }

  var newState = state;

  switch (action.type) {
    case TYPES.SET_WEB3_CONFIG:
      newState = _.merge(
        {},
        newState,
        {config: {[action.key]: action.config}},
      );
    case TYPES.SET_WEB3_STATUS:
      newState = _.merge(
        {},
        newState,
        {status: {isConnected: action.isConnected}},
      );
    case TYPES.SET_WEB3_BROWSER_AVAILABILITY:
      newState = _.merge(
        {},
        newState,
        {isBrowserAvailable: action.isAvailable},
      );
    case TYPES.SET_WEB3_SELECTION:
      newState = _.merge(
        {},
        newState,
        {selectedWeb3: action.selection},
      );
      break;
    case TYPES.SET_WEB3:
      newState = _.merge(
        {},
        newState, 
        {web3: action.web3}
      );
      break;
    case TYPES.SET_WEB3_ETH_ACCOUNTS:
      newState = Object.assign({}, newState, {
        accounts: action.accounts,
      });
      break;
  }

  return newState;
}
