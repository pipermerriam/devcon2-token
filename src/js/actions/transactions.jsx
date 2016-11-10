import _ from 'lodash'
import TYPES from './types'
import { getTransaction, getTransactionReceipt } from '../services/web3'


export function startTrackingTransaction(transactionHash) {
  return function(dispatch, getState) {
    // TODO: setup interval, dis
    let intervalID = setInterval(....)

    dispatch(getTransactionDetails(transactionHash))
  }
}

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
      // TODO: maybe stopTrackingTransaction is receipt is filled in.
    }), function(error) {
      console.error(error)
    })
  }
}

export function stopTrackingTransaction(transactionHash) {
  return function(dispatch, getState) {
    let intervalID = _.get(
      getState().transactions.transactionDetails,
      `${transactionHash}.intervalID`
    )

    if (_.isNumeric(intervalID)) {
      window.clearInterval(intervalID)
      dispatch(updateTransaction(transactionHash, {intervalID: null}))
    }
  }
}

export function addTransaction(transactionHash, transactionDetails) {
  return {
    type: TYPES.ADD_TRANSACTION,
    transactionHash: transactionHash,
    transactionDetails: transactionDetails,
  }
}

export function updateTransaction(transactionHash, transactionDetails) {
  return {
    type: TYPES.UPDATE_TRANSACTION,
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
