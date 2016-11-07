import TYPES from '../actions/types'
import _ from 'lodash'

var initialState = {
  addressDetails: {},
};

export default function(state, action) {
  if (state === undefined) {
    return initialState;
  }

  var newState = state;

  switch (action.type) {
    case TYPES.SET_ADDRESS_DATA:
      console.log('SETTING ADDRESS DATA');
      newState = Object.assign({}, newState, {
        addressDetails: Object.assign(
          {},
          newState.addressDetails,
          {[action.address]: action.addressData},
        ),
      });
      break;
  }

  return newState;
}

