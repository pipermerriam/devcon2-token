import TYPES from '../actions/types'

var initialState = {
  selectedWeb3: null,
  web3Options: null,
  web3: null,
};

export default function(state, action) {
  if (state === undefined) {
    return initialState;
  }

  var newState = state;

  switch (action.type) {
    case TYPES.SET_WEB3_OPTIONS:
      console.log('SETTING WEB3 OPTIONS');
      newState = Object.assign({}, newState, {
        web3Options: action.options,
      });
    case TYPES.SET_WEB3_SELECTION:
      console.log('SETTING WEB3 SELECTION');
      newState = Object.assign({}, newState, {
        selectedWeb3: action.selection,
      });
      break;
    case TYPES.SET_WEB3:
      console.log('SETTING WEB3');
      newState = Object.assign({}, newState, {
        web3: action.web3,
      });
      break;
  }

  return newState;
}
