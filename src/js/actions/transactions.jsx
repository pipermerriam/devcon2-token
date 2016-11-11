import _ from 'lodash'
import TYPES from './types'
import { getTransaction, getTransactionReceipt } from '../services/web3'


export function getTransactionDetails(transactionHash) {
  return function(dispatch, getState) {
    return Promise.all([
      getTransaction(transactionHash),
      getTransactionReceipt(transactionHash),
    ]).then(_.spread(function(transaction, receipt) {
      dispatch(updateTransaction(transactionHash, {
        transaction,
        receipt,
      }))
    }), function(error) {
      console.error(error)
    })
  }
}

export function setTransaction(transactionHash, transactionDetails) {
  return {
    type: TYPES.SET_TRANSACTION,
    transactionHash: transactionHash,
    transactionDetails: transactionDetails,
  }
}

export function removeTransaction(transactionHash) {
  return {
    type: TYPES.REMOVE_TRANSACTION,
    transactionHash: transactionHash,
  }
}
