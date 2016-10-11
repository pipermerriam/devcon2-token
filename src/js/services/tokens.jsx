import _ from 'lodash';
import Devcon2TokenAssets from '../../contracts/devcon2_token'


export function getDevcon2Token(web3) {
  var devcon2Token = web3.eth.contract(Devcon2TokenAssets.abi).at('0x0a43edfe106d295e7c1e591a4b04b5598af9474c');
  return Promise.resolve(devcon2Token);
}

export function getTokenData(tokenId, web3) {
  return new Promise(function(resolve, reject) {
    if (web3 === null) {
      reject("Got null web3 object");
    }
    getDevcon2Token(web3).then(function(devcon2Token) {
      devcon2Token.ownerOf.call(tokenId, function(err, result) {
        if (!err) {
          resolve({owner: result})
        } else {
          reject(err);
        }
      });
    });
  });
}
