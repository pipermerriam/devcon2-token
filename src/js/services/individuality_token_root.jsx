import _ from 'lodash'
import IndividualityTokenRootAssets from '../../contracts/individuality_token_root'
import { getTokenIdentity } from './devcon2_token'
import { getWeb3, getCoinbase } from './web3'

var contractAddress = null

export function setContractAddress(_contractAddress) {
  contractAddress = _contractAddress
  return Promise.resolve(contractAddress)
}

export function getContractAddress() {
  return Promise.resolve(contractAddress)
}

export function getIndividualityTokenRoot(web3) {
  return new Promise(function(resolve, reject) {
    getWeb3().then(function(web3) {
      if (contractAddress === null) {
        reject("IndividualityTokenRoot contract address is 'null'")
      } else {
        resolve(web3.eth.contract(IndividualityTokenRootAssets.abi).at(contractAddress))
      }
    }, function(error) {
      console.error(error)
    })
  })
}

export function getTotalSupply() {
  return new Promise(function(resolve, reject) {
    getIndividualityTokenRoot().then(function(individualityTokenRoot) {
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

export function getUpgradeCount() {
  return new Promise(function(resolve, reject) {
    getIndividualityTokenRoot().then(function(individualityTokenRoot) {
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

export function getTokenMeta() {
  return new Promise(function(resolve, reject) {
    return Promise.all([
      getTotalSupply(),
      getUpgradeCount(),
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

export function getTokenOwner(tokenIdBytes) {
  return new Promise(function(resolve, reject) {
    getIndividualityTokenRoot().then(function(individualityTokenRoot) {
      individualityTokenRoot.ownerOf.call(tokenIdBytes, function(err, result) {
        if (!err) {
          resolve(result)
        } else {
          reject(err)
        }
      })
    })
  })
}

export function getIsTokenUpgraded(tokenIdBytes) {
  return new Promise(function(resolve, reject) {
    getIndividualityTokenRoot().then(function(individualityTokenRoot) {
      individualityTokenRoot.isTokenUpgraded.call(tokenIdBytes, function(err, result) {
        if (!err) {
          resolve(result)
        } else {
          reject(err)
        }
      })
    })
  })
}

export function getTokenData(tokenIdBytes) {
  return new Promise(function(resolve, reject) {
    getIndividualityTokenRoot().then(function() {
      Promise.all([
        getTokenOwner(tokenIdBytes),
        getTokenIdentity(tokenIdBytes),
        getIsTokenUpgraded(tokenIdBytes),
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

export function getIsTokenOwner(address) {
  return new Promise(function(resolve, reject) {
    getIndividualityTokenRoot().then(function(individualityTokenRoot) {
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

export function getTokenId(address) {
  return new Promise(function(resolve, reject) {
    Promise.all([
      getIndividualityTokenRoot(),
      getWeb3(),
    ]).then(_.spread(function(individualityTokenRoot, web3) {
      individualityTokenRoot.tokenId.call(address, function(err, result) {
        if (!err) {
          resolve(web3.toHex(result))
        } else {
          reject(err)
        }
      })
    }))
  })
}

export function getAddressData(address) {
  return new Promise(function(resolve, reject) {
    Promise.all([
      getIsTokenOwner(address),
      getTokenId(address),
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

const UPGRADE_GAS = 200000

export function proxyUpgrade(currentOwner, tokenRecipient, signature) {
  return new Promise(function(resolve, reject) {
    Promise.all([
      getIndividualityTokenRoot(),
      getCoinbase(),
      getWeb3(),
    ]).then(_.spread(function(individualityTokenRoot, coinbase, web3) {
      let signatureBytes = web3.toAscii(signature)
      individualityTokenRoot.proxyUpgrade.sendTransaction(currentOwner, tokenRecipient, signatureBytes, {from: coinbase, gas: UPGRADE_GAS}, function(err, result) {
        if (!err) {
          resolve(result)
        } else {
          reject(err)
        }
      })
    }), function(error) {
      reject(error)
    })
  })
}

export function directUpgrade(account) {
  return new Promise(function(resolve, reject) {
    getIndividualityTokenRoot().then(function(individualityTokenRoot) {
      individualityTokenRoot.upgrade.sendTransaction({from: account, gas: UPGRADE_GAS}, function(err, result) {
        if (!err) {
          resolve(result)
        } else {
          reject(err)
        }
      })
    })
  })
}
