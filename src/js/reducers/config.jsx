import TYPES from '../actions/types'

// mainnet
//var initialState = {
//  DEVCON2_TOKEN_CONTRACT_ADDRESS: '0x0a43edfe106d295e7c1e591a4b04b5598af9474c',
//  INDIVIDUALITY_TOKEN_ROOT_CONTRACT_ADDRESS: '0xC59162bbe31b2ECa8E3d7d3401DC05f64E293f83',
//};

// morden
var initialState = {
  DEVCON2_TOKEN_CONTRACT_ADDRESS: '0x21Ac6a8e3B3De98a39D494b32756F1cEC77AC712',
  INDIVIDUALITY_TOKEN_ROOT_CONTRACT_ADDRESS: '0x7c3cb6abf83e7e5aa41e5e52a2c4b790b78d0057',
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
