import TYPES from '../actions/types'

// mainnet
//var initialState = {
//  DEVCON2_TOKEN_CONTRACT_ADDRESS: '0x0a43edfe106d295e7c1e591a4b04b5598af9474c',
//  INDIVIDUALITY_TOKEN_ROOT_CONTRACT_ADDRESS: 'TODO',
//};

// morden
var initialState = {
  DEVCON2_TOKEN_CONTRACT_ADDRESS: '0x45deb3443db24211f2d419b3396e0e47bcc8042b',
  INDIVIDUALITY_TOKEN_ROOT_CONTRACT_ADDRESS: '0xe4c0e36dea1c062ebd00be3c63cd57449d193f86',
};

export default function(state, action) {
  if (state === undefined) {
    return initialState;
  }

  var newState = state;

  switch (action.type) {
    case TYPES.SET_CONFIG:
      newState = _.merge(
        {},
        newState,
        action.config,
      );
  }

  return newState;
}
