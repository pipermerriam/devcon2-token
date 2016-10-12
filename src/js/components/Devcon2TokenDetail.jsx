import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import actions from '../actions'
import TokenID from './TokenID'
import EthereumAddress from './EthereumAddress'
import HideIfNoWeb3 from './HideIfNoWeb3'


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
    return this.props.tokens[this.tokenID()]
  },
  renderBody() {
    var tokenData = this.tokenData()
    if (_.isEmpty(tokenData)) {
      return (
        <p>Loading....</p>
      )
    } else {
      return (
        <dl className="row">
          <dt className="col-sm-3">Token ID</dt>
          <dd className="col-sm-9"><TokenID tokenId={this.tokenID()} length={null} /></dd>
          <dt className="col-sm-3">Owner</dt>
          <dd className="col-sm-9"><EthereumAddress address={tokenData.owner} imageSize={32} /></dd>
          <dt className="col-sm-3">Identity</dt>
          <dd className="col-sm-9"><pre><code>{tokenData.identity}</code></pre></dd>
        </dl>
      )
    }
  },
  render() {
    return (
      <div>
        <div className="row">
          <h2 className="col-sm-12">Token Details</h2>
        </div>
        {this.renderBody()}
      </div>
    )
  }
})))
