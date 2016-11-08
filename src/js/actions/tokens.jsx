import _ from 'lodash'
import TYPES from './types'
import { getTokenData, getTokenMeta, submitProxyUpgradeSignature } from '../services/individuality_token_root'
import { computeSha3 } from '../services/web3'

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
    getTokenData(state.web3.web3, tokenId).then(function(result) {
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

export function updateTokenUpgradeTarget(tokenId, target) {
  return function(dispatch, getState) {
    dispatch(setTokenUpgradeTarget(tokenId, target))
    var state = getState()
    var web3 = state.web3.web3
    var tokenData = state.tokens.tokenDetails[tokenId]
    var upgradeTarget = _.get(state.tokens.upgradeData, tokenId + '.target', tokenData.owner)
    var bytesToSign = _.join([
      web3.toAscii('0xC59162bbe31b2ECa8E3d7d3401DC05f64E293f83'),
      web3.toAscii(tokenData.owner),
      web3.toAscii(upgradeTarget),
    ], '')
    computeSha3(state.web3.web3, bytesToSign).then(function(dataHash) {
      dispatch(setTokenUpgradeDataHash(tokenId, dataHash))
    }, function(error) {
      console.error(error)
    })
  }
}

export function setTokenUpgradeTarget(tokenId, target) {
  return {
    type: TYPES.SET_TOKEN_UPGRADE_TARGET,
    tokenId: tokenId,
    target: target,
  }
}

export function setTokenUpgradeDataHash(tokenId, dataHash) {
  return {
    type: TYPES.SET_TOKEN_UPGRADE_DATA_HASH,
    tokenId: tokenId,
    dataHash: dataHash,
  }
}

export function signTokenUpgradeData(tokenId, account, bytesToSign) {
  return function(dispatch, getState) {
    var web3 = getState().web3.web3
    signData(web3, account, bytesToSign).then(function(signature) {
      dispatch(setTokenUpgradeSignature(tokenId, bytesToSign, signature))
    }, function(error) {
      console.error(error)
    })
  }
}

export function setTokenUpgradeSignature(tokenId, signedBytes, signature) {
  return {
    type: TYPES.SET_TOKEN_UPGRADE_SIGNATURE,
    tokenId: tokenId,
    signedBytes: signedBytes,
    signature: signature,
  }
}

export function submitTokenUpgradeSignature(tokenId, signature) {
  return function(dispatch, getState) {
    var web3 = getState().web3.web3
    submitProxyUpgradeSignature(web3, signature).then(function(transactionHash) {
      dispatch(setTokenUpgradeTransactionHash(tokenId, transactionHash))
    }, function(error) {
      console.error(error)
    })
  }
}
