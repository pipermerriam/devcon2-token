import React from 'react'
import { connect } from 'react-redux'
import actions from '../actions'
import HideIfNoWeb3 from './HideIfNoWeb3'
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

let TransactionRow = React.createClass({
  transactionStatus() {
    let statusType = 'success'
    return (
      <Tag type={statusType}>TODO</Tag>
    )
  },
  render() {
    return (
      <tr>
        <td>{this.props.idx + 1}</td>
        <td>{this.props.transactionHash}</td>
        <td>{this.transactionStatus()}</td>
      </tr>
    )
  }
})
