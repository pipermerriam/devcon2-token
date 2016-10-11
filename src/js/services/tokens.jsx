import { getWeb3 } from './web3'
import _ from 'lodash';
import Devcon2TokenAssets from '../../contracts/devcon2_token'


export function getDevcon2Token(address) {
  var web3 = getWeb3();
  var devcon2Token = web3.eth.contract(Devcon2TokenAssets.abi).at(address);
  return devcon2Token;
}


export function getAllTokenIDs() {
  var devcon2Token = getDevcon2Token('0x0a43edfe106d295e7c1e591a4b04b5598af9474c');
  var filter = devcon2Token.Mint({}, {
    'fromBlock': 2286853,  // one block before deployment.
    'toBlock': 2302732,  // one block after last minting.
  });
  return filter;
}

export function getTokenData(tokenId) {
  var devcon2Token = getDevcon2Token('0x0a43edfe106d295e7c1e591a4b04b5598af9474c');
  return new Promise(function(resolve, reject) {
    resolve({
      owner: devcon2Token.ownerOf.call(tokenId),
    });
  });
}
