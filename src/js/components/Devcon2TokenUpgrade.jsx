import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import _ from 'lodash'
import actions from '../actions'
import TokenID from './TokenID'
import EthereumChecksumAddress from './EthereumChecksumAddress'
import HideIfNoWeb3 from './HideIfNoWeb3'
import LoadingIfUndefined from './LoadingIfUndefined'

export default HideIfNoWeb3(connect((state) => state.tokens)(React.createClass({
  componentWillMount() {
    if (_.isEmpty(this.tokenData())) {
      this.props.dispatch(actions.loadTokenData(this.tokenID()))
    }
  },
  tokenID() {
    return this.props.params.id
  },
  tokenData() {
    return this.props.tokenDetails[this.tokenID()]
  },
  render() {
    const tokenData = this.tokenData()
    return (
      <LoadingIfUndefined targetValue={tokenData}>
        <div>
          <div className="row">
            <h2 className="col-sm-12">Method #1: Direct Upgrade</h2>
            <p>This method involves sending a transaction from <EthereumChecksumAddress address={_.get(tokenData, 'owner')} /> to the <code>upgrade()</code> function.  This requires your browser to have access to transaction sending from this account.</p>
          </div>
          <div className="row">
            <h2 className="col-sm-12">Method #2: Proxy Upgrade</h2>
            <p>This method involves submitting a cryptographic signature from <EthereumChecksumAddress address={_.get(tokenData, 'owner')} /> to the <code>proxyUpgrade()</code> function.  This method should be used if you do not have access to this address from your browser.</p>
          </div>
        </div>
      </LoadingIfUndefined>
    )
  }
})))

