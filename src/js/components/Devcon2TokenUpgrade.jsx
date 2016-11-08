import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import _ from 'lodash'
import actions from '../actions'
import TokenID from './TokenID'
import HideIfNoWeb3 from './HideIfNoWeb3'
import LoadingSpinner from './LoadingSpinner'
import DirectTokenUpgradeForm from './DirectTokenUpgradeForm'
import ProxyTokenUpgradeForm from './ProxyTokenUpgradeForm'

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
  renderAlreadyUpgraded() {
    const tokenID = this.tokenID()
    return (
      <div>
        <div className="row">
          <div className="col-sm-12">
            <p>Token has already been upgraded.  <Link to={`/tokens/${tokenID}`}>Back to token details...</Link></p>
          </div>
        </div>
      </div>
    )
  },
  renderUpgradeForm(tokenData) {
    return (
      <div>
        <h1>Upgrading token: <TokenID tokenId={this.tokenID()} length={null} /></h1>
        <DirectTokenUpgradeForm tokenId={this.tokenID()} tokenData={tokenData}/>
        <ProxyTokenUpgradeForm tokenId={this.tokenID()} tokenData={tokenData}/>
      </div>
    )
  },
  render() {
    const tokenData = this.tokenData()
    if (_.isEmpty(tokenData)) {
      return <LoadingSpinner />
    } else if (tokenData.isTokenUpgraded) {
      return this.renderAlreadyUpgraded()
    } else {
      return this.renderUpgradeForm(tokenData)
    }
  }
})))

