import React from 'react'
import { connect } from 'react-redux'
import actions from '../actions'
import BSCard from './BSCard'
import LoadingSpinner from './LoadingSpinner'
import EthereumAddress from './EthereumAddress'
import EthereumChecksumAddress from './EthereumChecksumAddress'

export default connect((state) => state.web3)(React.createClass({
  componentWillMount() {
    if (this.props.accounts === null) {
      this.props.dispatch(actions.getWeb3AccountList())
    }
  },
  submitDirectUpgrade(event) {
    this.props.dispatch(actions.submitDirectUpgrade(
      this.props.tokenId,
      this.props.tokenData.owner,
    )).then(function() {
      location.hash = 'transaction-list'
    })
  },
  isAddressInAccounts() {
    var web3 = this.props.web3
    var address = web3.toChecksumAddress(this.props.tokenData.owner)
    return _.some(this.props.accounts, function(account) {
      return (address === web3.toChecksumAddress(account))
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
        <div>
          <p>Upgrade token belonging to <EthereumAddress address={this.props.tokenData.owner} imageSize={10} />.</p>
          <button type="button" className="btn btn-primary" onClick={this.submitDirectUpgrade}>Upgrade Token</button>
        </div>
      )
    } else {
      return (
        <div>
          <div className="alert alert-warning" role="alert">
            <p>The address <EthereumChecksumAddress address={this.props.tokenData.owner} /> was not found in the list of available accounts.  In order to perform a a direct upgrade <code>web3</code> must have access to this account.</p>
          </div>
        </div>
      )
    }
  },
  render() {
    return (
      <div className="row">
        <h2 className="col-sm-12">Method #1: Direct Upgrade</h2>
        <div className="col-sm-12">
          <BSCard>
            <BSCard.Header>
              Perform Direct Upgrade
            </BSCard.Header>
            <BSCard.Block>
              {this.renderBody()}
            </BSCard.Block>
          </BSCard>
        </div>
      </div>
    )
  },
}))
