import TYPES from './types'
import { getWeb3Options, getDefaultWeb3, getSelectedWeb3, getWeb3Accounts, setWeb3, signData } from '../services/web3'
import { initializeChain } from './chain'
import { checkContractCode } from './tokens'

export function initializeWeb3() {
  return function(dispatch, getState) {
    return Promise.all([
      getWeb3Options(),
      getDefaultWeb3(),
    ]).then(_.spread(function(options, choice) {
      dispatch(setWeb3Options(options))
      dispatch(selectWeb3(choice))
    }), function(error) {
      console.error(error)
    })
  }
}

export function selectWeb3(choice) {
  return function(dispatch, getState) {
    getSelectedWeb3(choice).then(function(web3) {
      setWeb3(web3)
      dispatch(setWeb3Selection(choice))
      dispatch(setWeb3Instance(web3))
      dispatch(initializeChain())
      dispatch(checkContractCode())
    }, function(error) {
      console.error(error)
    })
  }
}

export function setWeb3Options(options) {
  return {
    type: TYPES.SET_WEB3_OPTIONS,
    options: options,
  }
}

export function setWeb3Selection(selection) {
  return {
    type: TYPES.SET_WEB3_SELECTION,
    selection: selection,
  }
}

export function setWeb3Instance(web3) {
  return {
    type: TYPES.SET_WEB3,
    web3: web3,
  }
}

export function getWeb3AccountList() {
  return function(dispatch, getState) {
    var p = _.isEmpty(getState().web3.web3) ? dispatch(initializeWeb3()) : Promise.resolve()
    return p.then(function() {
      var web3 = getState().web3.web3
      getWeb3Accounts(web3).then(function(accounts) {
        dispatch(setWeb3AccountList(accounts))
      }, function(error) {
        console.error(error)
      })
    })
  }
}

export function setWeb3AccountList(accounts) {
  return {
    type: TYPES.SET_WEB3_ETH_ACCOUNTS,
    accounts: accounts,
  }
}
