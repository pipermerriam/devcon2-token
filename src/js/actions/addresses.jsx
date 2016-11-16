import _ from 'lodash'
import TYPES from './types'
import { getAddressData } from '../services/devcon2_token'
import { loadTokenData } from './tokens'

export function loadAddressData(address) {
  return function(dispatch, getState) {
    var state = getState()
    return getAddressData(address).then(function(addressData) {
      if (addressData.isTokenOwner && _.isEmpty(state.tokens.tokenDetails[addressData.tokenId])) {
        dispatch(loadTokenData(addressData.tokenId))
      }
      dispatch(setAddressData(address, addressData))
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
