import _ from 'lodash'
import Devcon2TokenAssets from '../../contracts/devcon2_token'
import { getWeb3 } from './web3'

var contractAddress = null

export function setContractAddress(_contractAddress) {
  contractAddress = _contractAddress
  return Promise.resolve(contractAddress)
}

export function getDevcon2Token() {
  return new Promise(function(resolve, reject) {
    if (contractAddress === null) {
      reject("IndividualityTokenRoot contract address is 'null'")
    } else {
      getWeb3().then(function(web3) {
        resolve(web3.eth.contract(Devcon2TokenAssets.abi).at(contractAddress))
      }, function(error) {
        console.error(error)
      })
    }
  })
}

export function getTokenMeta() {
  return new Promise(function(resolve, reject) {
    getDevcon2Token().then(function(devcon2Token) {
      devcon2Token.totalSupply.call(function(err, result) {
        if (!err) {
          resolve({totalSupply: result})
        } else {
          reject(err)
        }
      })
    })
  })
}

export function getTokenOwner(tokenId) {
  return new Promise(function(resolve, reject) {
    getDevcon2Token().then(function(devcon2Token) {
      devcon2Token.ownerOf.call(tokenId, function(err, result) {
        if (!err) {
          resolve(result)
        } else {
          reject(err)
        }
      })
    })
  })
}

export function getTokenIdentity(tokenId) {
  return new Promise(function(resolve, reject) {
    getDevcon2Token().then(function(devcon2Token) {
      devcon2Token.identityOf.call(tokenId, function(err, result) {
        if (!err) {
          resolve(result)
        } else {
          reject(err)
        }
      })
    })
  })
}

export function getTokenData(tokenId) {
  return new Promise(function(resolve, reject) {
    getDevcon2Token().then(function(devcon2Token) {
      Promise.all([
        getTokenOwner(tokenId),
        getTokenIdentity(tokenId),
      ]).then(_.spread(function(owner, identity) {
        resolve({
          owner,
          identity,
        })
      }), function(error) {
        reject(error)
      })
    })
  })
}

export function getIsTokenOwner(address) {
  return new Promise(function(resolve, reject) {
    getDevcon2Token().then(function(devcon2Token) {
      devcon2Token.isTokenOwner.call(address, function(err, result) {
        if (!err) {
          resolve(result)
        } else {
          reject(err)
        }
      })
    })
  })
}

export function getTokenID(address) {
  return new Promise(function(resolve, reject) {
    Promise.all([
      getDevcon2Token(),
      getWeb3(),
    ]).then(_.spread(function(devcon2Token, web3) {
      devcon2Token.balanceOf.call(address, function(err, result) {
        if (!err) {
          resolve(web3.fromDecimal(result))
        } else {
          reject(err)
        }
      })
    }))
  })
}

export function getAddressData(address) {
  return new Promise(function(resolve, reject) {
    getDevcon2Token().then(function(devcon2Token) {
      Promise.all([
        getIsTokenOwner(address),
        getTokenID(address),
      ]).then(_.spread(function(isTokenOwner, tokenId) {
        resolve({
          isTokenOwner,
          tokenId,
        })
      }), function(error) {
        reject(error)
      })
    })
  })
}
