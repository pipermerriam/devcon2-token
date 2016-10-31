import _ from 'lodash';
import Devcon2TokenAssets from '../../contracts/devcon2_token'


export function getDevcon2Token(web3) {
  var devcon2Token = web3.eth.contract(Devcon2TokenAssets.abi).at('0x0a43edfe106d295e7c1e591a4b04b5598af9474c');
  return Promise.resolve(devcon2Token);
}

export function getTokenOwner(tokenId, web3) {
  return new Promise(function(resolve, reject) {
    getDevcon2Token(web3).then(function(devcon2Token) {
      devcon2Token.ownerOf.call(tokenId, function(err, result) {
        if (!err) {
          resolve(result)
        } else {
          reject(err);
        }
      });
    });
  });
}

export function getTokenIdentity(tokenId, web3) {
  return new Promise(function(resolve, reject) {
    getDevcon2Token(web3).then(function(devcon2Token) {
      devcon2Token.identityOf.call(tokenId, function(err, result) {
        if (!err) {
          resolve(result)
        } else {
          reject(err);
        }
      });
    });
  });
}

export function getTokenData(tokenId, web3) {
  return new Promise(function(resolve, reject) {
    getDevcon2Token(web3).then(function(devcon2Token) {
      Promise.all([
        getTokenOwner(tokenId, web3),
        getTokenIdentity(tokenId, web3),
      ]).then(_.spread(function(owner, identity) {
        resolve({
          owner,
          identity,
        });
      }), function(error) {
        reject(error);
      });
    });
  });
}

export function getTokenMeta(web3) {
  return new Promise(function(resolve, reject) {
    getDevcon2Token(web3).then(function(devcon2Token) {
      devcon2Token.totalSupply.call(function(err, result) {
        if (!err) {
          resolve({totalSupply: result})
        } else {
          reject(err);
        }
      });
    });
  });
}

export function getIsTokenOwner(address, web3) {
  return new Promise(function(resolve, reject) {
    getDevcon2Token(web3).then(function(devcon2Token) {
      devcon2Token.isTokenOwner.call(address, function(err, result) {
        if (!err) {
          resolve(result)
        } else {
          reject(err);
        }
      });
    })
  })
}

export function getTokenID(address, web3) {
  return new Promise(function(resolve, reject) {
    getDevcon2Token(web3).then(function(devcon2Token) {
      devcon2Token.balanceOf.call(address, function(err, result) {
        if (!err) {
          resolve(web3.fromDecimal(result))
        } else {
          reject(err);
        }
      });
    })
  })
}

export function getAddressData(address, web3) {
  return new Promise(function(resolve, reject) {
    getDevcon2Token(web3).then(function(devcon2Token) {
      Promise.all([
        getIsTokenOwner(address, web3),
        getTokenID(address, web3),
      ]).then(_.spread(function(isTokenOwner, tokenId) {
        resolve({
          isTokenOwner,
          tokenId,
        });
      }), function(error) {
        reject(error);
      });
    });
  });
}
