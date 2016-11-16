import _ from 'lodash'
import TYPES from './types'
import { getDefaultWeb3, getSelectedWeb3, getWeb3Accounts, setWeb3, signData, isConnected, isBrowserAvailable } from '../services/web3'
import { loadChainMetaData, resetChainMetaData } from './chain'
import { checkContractCode } from './tokens'

export function initializeWeb3() {
  return function(dispatch, getState) {
    const selectedWeb3 = getState().web3.selectedWeb3
    if (_.isEmpty(selectedWeb3)) {
      return getDefaultWeb3().then(function(choice) {
        dispatch(selectWeb3(choice))
      }, function(error) {
        console.error(error)
      })
    } else {
      return dispatch(selectWeb3(selectedWeb3))
    }
  }
}

export function selectWeb3(choice) {
  return function(dispatch, getState) {
    const config = _.get(getState().web3.config, choice, {})
    return getSelectedWeb3(choice, config).then(function(web3) {
      setWeb3(web3).then(function() {
        dispatch(resetChainMetaData())
        dispatch(resetWeb3Status())
      }).then(function() {
        dispatch(setWeb3Selection(choice))
        dispatch(setWeb3Instance(web3))
      }).then(function() {
        dispatch(getWeb3AccountList())
        dispatch(loadChainMetaData())
        dispatch(updateWeb3Status())
        dispatch(checkContractCode())
      })
    }, function(error) {
      console.error(error)
    })
  }
}

export function updateWeb3BrowserAvailability() {
  return function(dispatch, getState) {
    return isBrowserAvailable().then(function(isAvailable) {
      dispatch(setWeb3BrowserAvailability(isAvailable))
    }, function(error) {
      console.error(error)
    })
  }
}

export function setWeb3BrowserAvailability(isAvailable) {
  return {
    type: TYPES.SET_WEB3_BROWSER_AVAILABILITY,
    isAvailable: isAvailable,
  }
}

export function updateWeb3Status() {
  return function(dispatch, getState) {
    return isConnected().then(function(connectionStatus) {
      dispatch(setWeb3Status(connectionStatus))
    }, function(error) {
      console.error(error)
    })
  }
}

export function resetWeb3Status() {
  return {
    type: TYPES.SET_WEB3_STATUS,
    isConnected: null,
  }
}

export function setWeb3Status(connectionStatus) {
  return {
    type: TYPES.SET_WEB3_STATUS,
    isConnected: connectionStatus,
  }
}

export function updateWeb3Config(key, config) {
  return function(dispatch, getState) {
    dispatch(setWeb3Config(key, config))
    const currentWeb3Selection = getState().web3.selectedWeb3
    if (currentWeb3Selection === key) {
      dispatch(selectWeb3(currentWeb3Selection))
    }
    return Promise.resolve()
  }
}

export function setWeb3Config(key, config) {
  return {
    type: TYPES.SET_WEB3_CONFIG,
    key: key,
    config: config,
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
