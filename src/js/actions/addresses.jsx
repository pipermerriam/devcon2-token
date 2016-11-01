import _ from 'lodash'
import TYPES from './types'
import { getAddressData } from '../services/tokens'

export function loadAddressData(address) {
  return function(dispatch, getState) {
    var state = getState()
    getAddressData(address, state.web3.web3).then(function(result) {
      dispatch(setAddressData(address, result))
    }, function(error) {
      console.error(error)
    })
  }
}

export function setAddressData(address, addressData) {
  return {
    type: TYPES.SET_ADDRESS_DATA,
    address: address,
    addressData: addressData,
  }
}
