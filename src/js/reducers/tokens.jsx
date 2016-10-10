import TYPES from '../actions/types'

var initialState = {
  tokens: [],
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
      break;
  }

  return newState;
}
