import TYPES from '../actions/types'

// mainnet

let initialState = {
  DEVCON2_TOKEN_CONTRACT_ADDRESS: '0x0a43edfe106d295e7c1e591a4b04b5598af9474c',
  INDIVIDUALITY_TOKEN_ROOT_CONTRACT_ADDRESS: '0xdd94de9cfe063577051a5eb7465d08317d8808b6',
};

// morden

//let initialState = {
//  DEVCON2_TOKEN_CONTRACT_ADDRESS: '0x45deb3443db24211f2d419b3396e0e47bcc8042b',
//  INDIVIDUALITY_TOKEN_ROOT_CONTRACT_ADDRESS: '0x56f94284acac8c94169f569b16bbc540ed10f771',
//};

export default function(state, action) {
  if (state === undefined) {
    return initialState;
  }

  let newState = state;

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
