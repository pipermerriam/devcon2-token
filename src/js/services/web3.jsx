import Web3 from 'web3'
import _ from 'lodash'


const INFURA = 'INFURA';
const BROWSER = 'BROWSER';
const LOCALHOST = 'LOCALHOST';

let getInfuraWeb3 = _.memoize(function() {
  return new Promise(function(resolve, reject) {
    resolve(new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io')));
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
      ["Mainnet (infura)", INFURA],
      ["Localhost", LOCALHOST],
    ];
    resolve(choices);
  });
}

export function getWeb3(choice) {
  return new Promise(function(resolve, reject) {
    getWeb3Options().then(function(allowedChoices) {
      var allowChoiceValues = _.unzip(allowedChoices)[1];
      if (_.indexOf(allowChoiceValues, choice) < 0) {
        reject(`Invalid choice '${choice}'.  Allowed options are ${_.join(allowChoiceValues, ' ')}`);
      } else if (choice === INFURA) {
        return getInfuraWeb3().then(resolve, reject);
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
      resolve(web3.isConnected());
    }, function(error) {
      resolve(false);
    });
  });
}

function isInfuraAvailable() {
  return new Promise(function(resolve, reject) {
    getInfuraWeb3().then(function(web3) {
      resolve(web3.isConnected());
    });
  });
}

export function getDefaultWeb3() {
  return new Promise(function(resolve, reject) {
    Promise.all([
      isBrowserAvailable(),
      isInfuraAvailable(),
    ]).then(function(availability) {
      if (availability[0] === true) {
        resolve(BROWSER);
      } else if (availability[1] === true) {
        resolve(INFURA);
      } else {
        resolve(null);
      }
    })
  });
}

export function getWeb3Accounts(web3) {
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
