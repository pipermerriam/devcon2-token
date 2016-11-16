import Web3 from 'web3'
import _ from 'lodash'

let _web3 = null

export function setWeb3(web3) {
  _web3 = web3
  return Promise.resolve(web3)
}

export function getWeb3() {
  return new Promise(function(resolve, reject) {
    if (_web3 === null) {
      reject("Current _web3 is set to 'null'")
    } else {
      resolve(_web3)
    }
  })
}

export const INFURA_MAINNET = 'INFURA (Mainnet)';
export const INFURA_MORDEN = 'INFURA (Morden)';
export const BROWSER = 'BROWSER';
export const CUSTOM = 'CUSTOM';

const ALLOWED_CHOICES = [BROWSER, CUSTOM, INFURA_MAINNET, INFURA_MORDEN]

export const DEFAULT_LOCALHOST_RPCHOST = 'http://localhost:8545'

let getInfuraMainnetWeb3 = _.memoize(function() {
  return new Promise(function(resolve, reject) {
    resolve(new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io')));
  })
})

let getInfuraMordenWeb3 = _.memoize(function() {
  return new Promise(function(resolve, reject) {
    resolve(new Web3(new Web3.providers.HttpProvider('https://morden.infura.io')));
  })
})

let getCustomWeb3 = _.memoize(function(rpcHost) {
  return new Promise(function(resolve, reject) {
    resolve(new Web3(new Web3.providers.HttpProvider(rpcHost)));
  });
})

function getBrowserWeb3(rpcHost) {
  return new Promise(function(resolve, reject) {
    if (window == undefined) {
      reject("window is undefined");
    } else if (window.web3 === undefined) {
      reject("No web3 instance found on window");
    } else {
      resolve(window.web3);
    }
  });
}


export function getSelectedWeb3(choice, config) {
  return new Promise(function(resolve, reject) {
    if (choice === INFURA_MAINNET) {
      return getInfuraMainnetWeb3().then(resolve, reject);
    } else if (choice === INFURA_MORDEN) {
      return getInfuraMordenWeb3().then(resolve, reject);
    } else if (choice === BROWSER) {
      return getBrowserWeb3().then(resolve, reject);
    } else if (choice === CUSTOM) {
      const rpcHost = _.get(config, 'rpcHost', DEFAULT_LOCALHOST_RPCHOST)
      return getCustomWeb3(rpcHost).then(resolve, reject);
    } else {
      reject(`Unknown choice '${choice}'.  Allowed options are ${_.join(ALLOWED_CHOICES, ' ')}`);
    }
  });
}

export function isBrowserAvailable() {
  return new Promise(function(resolve, reject) {
    getBrowserWeb3().then(function(web3) {
      web3.net.getListening(function(err, result) {
        if (!err) {
          resolve(result)
        } else {
          resolve(false)
        }
      });
    }, function(error) {
      console.info("No web3 found in browser context")
      resolve(false);
    });
  });
}

function isInfuraMainnetAvailable() {
  return new Promise(function(resolve, reject) {
    getInfuraMainnetWeb3().then(function(web3) {
      web3.net.getListening(function(err, result) {
        if (!err) {
          resolve(result)
        } else {
          resolve(false)
        }
      });
    });
  });
}

function isInfuraMordenAvailable() {
  return new Promise(function(resolve, reject) {
    getInfuraMordenWeb3().then(function(web3) {
      web3.net.getListening(function(err, result) {
        if (!err) {
          resolve(result)
        } else {
          resolve(false)
        }
      });
    });
  });
}

function isLocalhostAvailable() {
  return new Promise(function(resolve, reject) {
    getCustomWeb3('http://localhost:8545').then(function(web3) {
      web3.net.getListening(function(err, result) {
        if (!err) {
          resolve(result)
        } else {
          resolve(false)
        }
      });
    });
  });
}

export function getDefaultWeb3() {
  return new Promise(function(resolve, reject) {
    Promise.all([
      isLocalhostAvailable(),
      isBrowserAvailable(),
      isInfuraMainnetAvailable(),
      isInfuraMordenAvailable(),
    ]).then(_.spread(function(localhostAvailable, browserAvailable, infuraMainnetAvailable, infuraMordenAvailable) {
      if (localhostAvailable === true) {
        resolve(CUSTOM);
      } else if (browserAvailable === true) {
        resolve(BROWSER);
      } else if (infuraMainnetAvailable === true) {
        resolve(INFURA_MAINNET);
      } else if (infuraMordenAvailable === true) {
        resolve(INFURA_MORDEN);
      } else {
        resolve(null);
      }
    }))
  });
}

export function getWeb3Accounts(web3 = _web3) {
  return new Promise(function(resolve, reject) {
    web3.eth.getAccounts(function(error, result) {
      if (!error) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })
}

export function computeSha3(dataAsHex, web3 = _web3) {
  return Promise.resolve(web3.sha3(dataAsHex, {encoding: 'hex'}))
}

export function signData(account, bytesToSign, web3 = _web3) {
  return new Promise(function(resolve, reject) {
    let hexToSign = web3.toHex(bytesToSign)
    computeSha3(hexToSign, web3).then(function(hashToSign) {
      web3.eth.sign(account, hashToSign, function(err, signature) {
        if (!err) {
          resolve(signature)
        } else {
          reject(error)
        }
      })
    }, function(error) {
      reject(error)
    })
  })
}

export function getBlock(blockIdentifier, web3 = _web3) {
  return new Promise(function(resolve, reject) {
    web3.eth.getBlock(blockIdentifier, function(err, block) {
      if (!err) {
        resolve(block)
      } else {
        reject(err)
      }
    })
  })
}

export function getCode(address, web3 = _web3) {
  return new Promise(function(resolve, reject) {
    web3.eth.getCode(address, function(err, code) {
      if (!err) {
        resolve(code)
      } else {
        reject(err)
      }
    })
  })
}

export function getTransaction(transactionHash, web3 = _web3) {
  return new Promise(function(resolve, reject) {
    web3.eth.getTransaction(transactionHash, function(err, transaction) {
      if (!err) {
        resolve(transaction)
      } else {
        reject(err)
      }
    })
  })
}

export function getTransactionReceipt(transactionHash, web3 = _web3) {
  return new Promise(function(resolve, reject) {
    web3.eth.getTransactionReceipt(transactionHash, function(err, receipt) {
      if (!err) {
        resolve(receipt)
      } else {
        reject(err)
      }
    })
  })
}

export function getCoinbase(web3 = _web3) {
  return new Promise(function(resolve, reject) {
    web3.eth.getCoinbase(function(err, coinbase) {
      if (!err) {
        resolve(coinbase)
      } else {
        reject(err)
      }
    })
  })
}

export function sendTransaction(transaction, web3 = _web3) {
  return new Promise(function(resolve, reject) {
    web3.eth.sendTransaction(transaction, function(err, transactionHash) {
      if (!err) {
        resolve(transactionHash)
      } else {
        reject(err)
      }
    })
  })
}

export function isConnected(web3 = _web3) {
  return new Promise(function(resolve, reject) {
    web3.net.getListening(function(err, result) {
      if (!err) {
        resolve(result)
      } else {
        resolve(false)
      }
    });
  })
}
