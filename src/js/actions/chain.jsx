import TYPES from './types'
import { getBlock } from '../services/web3'


const MAINNET_BLOCK_0_HASH = '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3'
const MORDEN_BLOCK_0_HASH = '0x0cd786a2425d16f152c658316c423e6ce1181e15c3295826d7c9904cba9ce303'


export function loadChainMetaData() {
  return function(dispatch, getState) {
    dispatch(resetChainMetaData())
    return getBlock('earliest').then(function(block) {
      dispatch(setChainMetaData({
        isLoaded: true,
        isMainnet: block.hash === MAINNET_BLOCK_0_HASH,
        isMorden: block.hash === MORDEN_BLOCK_0_HASH,
      }))
    }, function(error) {
      console.error(error)
    })
  }
}

export function resetChainMetaData() {
  return {
    type: TYPES.SET_CHAIN_METADATA,
    metaData: {
      isLoaded: false,
      isMainnet: null,
      isMorden: null,
    }
  }
}

export function setChainMetaData(metaData) {
  return {
    type: TYPES.SET_CHAIN_METADATA,
    metaData: metaData,
  }
}
