import Web3 from 'web3'


var web3;


export function getWeb3() {
  if (web3 === undefined) {
    web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
  }
  return web3;
}
