import _ from 'lodash'
import TYPES from './types'
import { getTokenData, getTokenMeta } from '../services/tokens'

export function loadTokenMeta() {
  return function(dispatch, getState) {
    var state = getState()
    getTokenMeta(state.web3.web3).then(function(result) {
      dispatch(setTokenMeta(result))
    }, function(error) {
      console.error(error)
    })
  }
}

export function setTokenMeta(tokenMeta) {
  return {
    type: TYPES.SET_TOKEN_META,
    tokenMeta: tokenMeta,
  }
}

export function loadTokenData(tokenId) {
  return function(dispatch, getState) {
    var state = getState()
    getTokenData(tokenId, state.web3.web3).then(function(result) {
      dispatch(setTokenData(tokenId, result))
    }, function(error) {
      console.error(error)
    })
  }
}

export function setTokenData(tokenId, tokenData) {
  return {
    type: TYPES.SET_TOKEN_DATA,
    tokenId: tokenId,
    tokenData: tokenData,
  }
}
