import React from 'react'
import { connect } from 'react-redux'
import actions from '../actions'
import HideIfNoWeb3 from './HideIfNoWeb3'
import LoadingIfUndefined from './LoadingIfUndefined'
import Tag from './BSTag'

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
  return {}
}

let TransactionRow = connect(mapStateToTransactionRow)(React.createClass({
  componentWillMount() {
  },
  componentWillUnmount() {
  },
  transaction() {
    return _.get(this.props.transactionData, 'transaction', null)
  },
  receipt() {
    return _.get(this.props.transactionData, 'receipt', null)
  },
  isMined() {
    return !_.isEmpty(_.get(this.transaction(), 'blockHash'))
  },
  renderStatus() {
    let statusType = this.isMined() ? 'success' : 'warning'
    let statusText = this.isMined() ? 'mined' : 'pending'
    return (
      <LoadingIfUndefined targetValue={this.transaction()}>
        <Tag type={statusType}>{statusText}</Tag>
      </LoadingIfUndefined>
    )
  },
  render() {
    return (
      <tr>
        <td>{this.props.idx + 1}</td>
        <td>{this.props.transactionHash}</td>
        <td>{this.props.transactionData.}</td>
        <td>{this.renderStatus()}</td>
      </tr>
    )
  }
}))
