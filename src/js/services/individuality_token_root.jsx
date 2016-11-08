import _ from 'lodash'
import IndividualityTokenRootAssets from '../../contracts/individuality_token_root'
import { getTokenIdentity } from './devcon2_token'


export function getIndividualityTokenRoot(web3) {
  var individualityTokenRoot = web3.eth.contract(IndividualityTokenRootAssets.abi).at('0xC59162bbe31b2ECa8E3d7d3401DC05f64E293f83')
  return Promise.resolve(individualityTokenRoot)
}

export function getTotalSupply(web3) {
  return new Promise(function(resolve, reject) {
    getIndividualityTokenRoot(web3).then(function(individualityTokenRoot) {
      individualityTokenRoot.totalSupply.call(function(err, result) {
        if (!err) {
          resolve(result)
        } else {
          reject(err)
        }
      })
    })
  })
}

export function getUpgradeCount(web3) {
  return new Promise(function(resolve, reject) {
    getIndividualityTokenRoot(web3).then(function(individualityTokenRoot) {
      individualityTokenRoot.upgradeCount.call(function(err, result) {
        if (!err) {
          resolve(result)
        } else {
          reject(err)
        }
      })
    })
  })
}

export function getTokenMeta(web3) {
  return new Promise(function(resolve, reject) {
    return Promise.all([
      getTotalSupply(web3),
      getUpgradeCount(web3),
    ]).then(_.spread(function(totalSupply, upgradeCount) {
      resolve({
        totalSupply,
        upgradeCount,
      })
    }), function(error) {
      reject(error)
    })
  })
}

export function getTokenOwner(web3, tokenId) {
  return new Promise(function(resolve, reject) {
    getIndividualityTokenRoot(web3).then(function(individualityTokenRoot) {
      individualityTokenRoot.ownerOf.call(tokenId, function(err, result) {
        if (!err) {
          resolve(result)
        } else {
          reject(err)
        }
      })
    })
  })
}

export function getIsTokenUpgraded(web3, tokenId) {
  return new Promise(function(resolve, reject) {
    getIndividualityTokenRoot(web3).then(function(individualityTokenRoot) {
      individualityTokenRoot.isTokenUpgraded.call(tokenId, function(err, result) {
        if (!err) {
          resolve(result)
        } else {
          reject(err)
        }
      })
    })
  })
}

export function getTokenData(web3, tokenId) {
  return new Promise(function(resolve, reject) {
    getIndividualityTokenRoot(web3).then(function() {
      Promise.all([
        getTokenOwner(web3, tokenId),
        getTokenIdentity(web3, tokenId),
        getIsTokenUpgraded(web3, tokenId),
      ]).then(_.spread(function(owner, identity, isTokenUpgraded) {
        resolve({
          owner,
          identity,
          isTokenUpgraded,
        })
      }), function(error) {
        reject(error)
      })
    })
  })
}

export function getIsTokenOwner(web3, address) {
  return new Promise(function(resolve, reject) {
    getIndividualityTokenRoot(web3).then(function(individualityTokenRoot) {
      individualityTokenRoot.isTokenOwner.call(address, function(err, result) {
        if (!err) {
          resolve(result)
        } else {
          reject(err)
        }
      })
    })
  })
}

export function getTokenID(web3, address) {
  return new Promise(function(resolve, reject) {
    getIndividualityTokenRoot(web3).then(function(individualityTokenRoot) {
      individualityTokenRoot.tokenId.call(address, function(err, result) {
        if (!err) {
          resolve(result)
        } else {
          reject(err)
        }
      })
    })
  })
}

export function getAddressData(web3, address) {
  return new Promise(function(resolve, reject) {
    Promise.all([
      getIsTokenOwner(web3, address),
      getTokenID(web3, address),
    ]).then(_.spread(function(isTokenOwner, tokenId) {
      resolve({
        isTokenOwner,
        tokenId,
      })
    }), function(error) {
      reject(error)
    })
  })
}

export function submitProxyUpgradeSignature(web3, signature) {
  return new Promise(function(resolve, reject) {
    getIndividualityTokenRoot(web3).then(function(individualityTokenRoot) {
      individualityTokenRoot.proxyUpgrade.call(signature, function(err, result) {
        if (!err) {
          resolve(result)
        } else {
          reject(err)
        }
      })
    })
  })
}
