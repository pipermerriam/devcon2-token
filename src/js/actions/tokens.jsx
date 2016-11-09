import _ from 'lodash'
import TYPES from './types'
import { getTokenData, getTokenMeta, proxyUpgrade, directUpgrade } from '../services/individuality_token_root'
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

export function updateTokenUpgradeParameters(tokenId, tokenContractAddress, currentOwner, tokenRecipient) {
  return function(dispatch, getState) {
    var web3 = getState().web3.web3

    var addressesToSign = [tokenContractAddress, currentOwner, tokenRecipient]

    var bytesToSign = ''
    var hexToSign = ''

    if (_.every(addressesToSign)) {
      bytesToSign = _.chain(addressesToSign).map(web3.toAscii).join('').value()
      hexToSign = web3.toHex(bytesToSign)
    }

    computeSha3(web3, bytesToSign).then(function(dataHash) {
      dispatch(setTokenUpgradeParameters(tokenId, {
        tokenContractAddress,
        currentOwner,
        tokenRecipient,
        bytesToSign,
        hexToSign,
        dataHash,
      }))
    }, function(error) {
      console.error(error)
    })
  }
}

export function setTokenUpgradeParameters(tokenId, upgradeParameters) {
  return {
    type: TYPES.SET_TOKEN_UPGRADE_PARAMETERS,
    tokenId: tokenId,
    upgradeParameters: upgradeParameters,
  }
}

export function createUpgradeSignature(tokenId, account, bytesToSign) {
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

export function submitProxyUpgrade(tokenId, currentOwner, tokenRecipient, signature) {
  return function(dispatch, getState) {
    var web3 = getState().web3.web3
    proxyUpgrade(web3, currentOwner, tokenRecipient, signature).then(function(transactionHash) {
      dispatch(setTokenUpgradeTransactionHash(tokenId, transactionHash))
    }, function(error) {
      console.error(error)
    })
  }
}

export function submitDirectUpgrade(tokenId, account) {
  return function(dispatch, getState) {
    var web3 = getState().web3.web3
    directUpgrade(web3, account).then(function(transactionHash) {
      dispatch(setTokenUpgradeTransactionHash(tokenId, transactionHash))
    }, function(error) {
      console.error(error)
    })
  }
}
