import React from 'react'
import { connect } from 'react-redux'
import actions from '../actions'
import LoadingSpinner from './LoadingSpinner'
import EthereumAddress from './EthereumAddress'
import EthereumChecksumAddress from './EthereumChecksumAddress'

export default connect((state) => state.web3)(React.createClass({
  componentWillMount() {
    if (this.props.accounts === null) {
      this.props.dispatch(actions.getWeb3AccountList())
    }
  },
  isAddressInAccounts() {
    var web3 = this.props.web3
    var address = web3.toChecksumAddress(this.props.tokenData.owner)
    return _.some(this.props.accounts, function(account) {
      return (address === web3.toChecksumAddress(account))
    })
  },
  renderWeb3Accounts() {
    return _.map(this.props.accounts, function(account, idx) {
      return (
        <li><EthereumAddress address={account} imageSize={16} key={idx} /></li>
      )
    })
  },
  renderBody() {
    if (this.props.accounts === null) {
      return (
        <div>
          <LoadingSpinner /> <span>Loading Accounts</span>
        </div>
      )
    } else if (this.isAddressInAccounts()){
      return (
        <p>Do it</p>
      )
    } else {
      return (
        <div>
          <p>This method requires sending a transaction from <EthereumChecksumAddress address={this.props.tokenData.owner} />.  This address was not found in the list of available accounts.  Please either configure <code>web3</code> such that it has access to this address or use the <em>Proxy Upgrade</em> method.</p>
          <p>Found the following accounts:</p>
          <ul>
            {this.renderWeb3Accounts()}
          </ul>
        </div>
      )
    }
  },
  render() {
    return (
      <div className="row">
        <h2 className="col-sm-12">Method #1: Direct Upgrade</h2>
        <p>This method involves sending a transaction  to the <code>upgrade()</code> function.</p>
        {this.renderBody()}
      </div>
    )
  },
}))
