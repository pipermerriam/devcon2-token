import TYPES from '../actions/types'
import { setContractAddress as setIndividualityRootContractAddress } from '../services/individuality_token_root'
import { setContractAddress as setDevcon2TokenContractAddress } from '../services/devcon2_token'


export function updateConfig(config) {
  return function(dispatch, getState) {
    dispatch(setConfig(config))
    var state = getState()
    setIndividualityRootContractAddress(state.config.INDIVIDUALITY_TOKEN_ROOT_CONTRACT_ADDRESS)
    setDevcon2TokenContractAddress(state.config.DEVCON2_TOKEN_CONTRACT_ADDRESS)
  }
}

export function setConfig(config) {
  return {
    type: TYPES.SET_CONFIG,
    config: config,
  }
}
