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

const INFURA_MAINNET = 'INFURA (Mainnet)';
const INFURA_MORDEN = 'INFURA (Morden)';
const BROWSER = 'BROWSER';
const LOCALHOST = 'LOCALHOST';

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

export function getWeb3Options() {
  return new Promise(function(resolve, reject) {
    var choices = []
    if (window !== undefined && window.web3 !== undefined) {
      var providerName = _.get(web3, 'currentProvider.constructor.name')
      var isMetamask = _.startsWith(providerName, 'Metamask')
      var displayName = isMetamask ? 'Metamask' : 'Browser'
      choices = [...choices, [displayName, BROWSER]];
    }
    choices = [
      ...choices,
      ["Mainnet (infura)", INFURA_MAINNET],
      ["Morden (infura)", INFURA_MORDEN],
      ["Localhost", LOCALHOST],
    ];
    resolve(choices);
  });
}

export function getSelectedWeb3(choice) {
  return new Promise(function(resolve, reject) {
    getWeb3Options().then(function(allowedChoices) {
      var allowChoiceValues = _.unzip(allowedChoices)[1];
      if (_.indexOf(allowChoiceValues, choice) < 0) {
        reject(`Invalid choice '${choice}'.  Allowed options are ${_.join(allowChoiceValues, ' ')}`);
      } else if (choice === INFURA_MAINNET) {
        return getInfuraMainnetWeb3().then(resolve, reject);
      } else if (choice === INFURA_MORDEN) {
        return getInfuraMordenWeb3().then(resolve, reject);
      } else if (choice === BROWSER) {
        return getBrowserWeb3().then(resolve, reject);
      } else if (choice === LOCALHOST) {
        return getCustomWeb3('http://localhost:8545').then(resolve, reject);
      } else {
        reject(`Unknown choice '${choice}'.  Allowed options are ${_.join(allowChoiceValues, ' ')}`);
      }
    });
  });
}

function isBrowserAvailable() {
  return new Promise(function(resolve, reject) {
    getBrowserWeb3().then(function(web3) {
      web3.net.getListening(function(err, result) {
        if (!err) {
          resolve(result)
        } else {
          reject(err)
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
          reject(err)
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
          reject(err)
        }
      });
    });
  });
}

export function getDefaultWeb3() {
  return new Promise(function(resolve, reject) {
    Promise.all([
      isBrowserAvailable(),
      isInfuraMainnetAvailable(),
      isInfuraMordenAvailable(),
    ]).then(_.spread(function(browserAvailable, infuraMainnetAvailable, infuraMordenAvailable) {
      if (browserAvailable === true) {
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

export function computeSha3(bytesToSign, web3 = _web3) {
  return Promise.resolve(web3.sha3(bytesToSign))
}

export function signData(account, bytesToSign, web3 = _web3) {
  return new Promise(function(resolve, reject) {
    computeSha3(web3, bytesToSign).then(function(hashToSign) {
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
