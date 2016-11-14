import React from 'react'
import { connect } from 'react-redux'
import actions from '../actions'
import HideIfNoWeb3 from './HideIfNoWeb3'
import Tag from './BSTag'
import Icon from './FAIcon'

function mapStateToTransactionListProps(state) {
  return {
    transactionDetails: state.transactions.transactionDetails,
  }
}

export default HideIfNoWeb3(connect(mapStateToTransactionListProps)(React.createClass({
  renderBody() {
    if (_.isEmpty(this.props.transactions)) {
      return (
        <tr>
          <td>-</td>
          <td colSpan="2">No Transactions</td>
        </tr>
      )
    } else {
      return _.map(this.props.transactions, function(transactionHash, idx) {
        let transactionData = _.get(this.props.transactionDetails, transactionHash, {})
        return (
          <TransactionRow key={idx} idx={idx} transactionHash={transactionHash} transactionData={transactionData} />
        )
      }.bind(this))
    }
  },
  render() {
    return (
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Transaction Hash</th>
            <th>Block</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {this.renderBody()}
        </tbody>
      </table>
    )
  },
})))

function mapStateToTransactionRow(state) {
  return {
    transactions: state.transactions,
  }
}

let TransactionRow = connect(mapStateToTransactionRow)(React.createClass({
  componentWillMount() {
    this.refresh()
  },
  componentWillUnmount() {
    this.cancelTimeout()
  },
  refresh() {
    if (this.isMined()) {
      this.cancelTimeout()
    } else if (this.isPending()) {
      this.props.dispatch(actions.getTransactionDetails(this.props.transactionHash))
      this.setTimeout()
    } else if (this.isLoading()) {
      this.setTimeout()
    }
  },
  cancelTimeout() {
    let timeoutID = _.get(this.props.transactionData(), 'timeoutID')
    if (_.isNumber(timeoutID)) {
      window.clearTimeout(timeoutID)
    }
    this.props.dispatch(actions.setTransaction(this.props.transactionHash, {
      isPolling: false,
      timeoutID: null,
    }))
  },
  setTimeout() {
      let timeoutID = window.setTimeout(this.refresh.bind(this), 2000)
      this.props.dispatch(actions.setTransaction(this.props.transactionHash, {
        isPolling: true,
        timeoutID: timeoutID,
      }))
  },
  isPolling() {
    return _.get(this.props.transactionData(), 'isPolling', False)
  },
  transactionData() {
    return _.get(this.props.transactions.transactionDetails, this.props.transactionHash)
  },
  transaction() {
    return _.get(this.props.transactionData(), 'transaction')
  },
  receipt() {
    return _.get(this.props.transactionData(), 'receipt')
  },
  isLoading() {
    return _.isEmpty(this.transaction())
  },
  isPending() {
    return !this.isLoading() && _.isEmpty(_.get(this.transaction(), 'blockHash'))
  },
  isMined() {
    return !this.isLoading() && !this.isPending()
  },
  getStatusData() {
    if (this.isLoading()) {
      return {type: 'info', text: 'loading', icon: {icon: 'spinner', spin: true}}
    } else if (this.isPending()) {
      return {type: 'warning', text: 'pending', icon: {icon: 'refresh', spin: true}}
    } else if (this.isMined()) {
      return {type: 'success', text: 'mined', icon: {icon: 'check'}}
    } else {
      throw 'Invariant.  This case should not be possible'
    }
  },
  getBlockNumber() {
    let blockNumber = _.get(this.receipt(), 'blockNumber')
    return blockNumber ? blockNumber : '--'
  },
  renderStatus() {
    let statusData = this.getStatusData()
    return (
      <Tag type={statusData.type}><Icon {...statusData.icon} />{statusData.text}</Tag>
    )
  },
  render() {
    return (
      <tr>
        <td>{this.props.idx + 1}</td>
        <td>{this.props.transactionHash}</td>
        <td>{this.blockNumber()}</td>
        <td>{this.renderStatus()}</td>
      </tr>
    )
  }
}))
