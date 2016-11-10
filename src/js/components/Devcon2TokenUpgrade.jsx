import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import _ from 'lodash'
import actions from '../actions'
import TokenID from './TokenID'
import HideIfNoTokenContract from './HideIfNoTokenContract'
import LoadingSpinner from './LoadingSpinner'
import DirectTokenUpgradeForm from './DirectTokenUpgradeForm'
import ProxyTokenUpgradeForm from './ProxyTokenUpgradeForm'

export default HideIfNoTokenContract(connect((state) => state.tokens)(React.createClass({
  componentWillMount() {
    if (_.isEmpty(this.tokenData())) {
      this.props.dispatch(actions.loadTokenData(this.tokenId()))
    }
  },
  tokenId() {
    return this.props.params.id
  },
  tokenData() {
    return this.props.tokenDetails[this.tokenId()]
  },
  renderAlreadyUpgraded() {
    const tokenId = this.tokenId()
    return (
      <div>
        <div className="row">
          <div className="col-sm-12 alert alert-info" role="alert">
            <p>Token has already been upgraded.  <Link to={`/tokens/${tokenId}`}>Back to token details...</Link></p>
          </div>
        </div>
      </div>
    )
  },
  renderUpgradeForm(tokenData) {
    return (
      <div>
        <h1>Upgrading Token: <TokenID tokenId={this.tokenId()} /></h1>
        <DirectTokenUpgradeForm tokenId={this.tokenId()} tokenData={tokenData}/>
        <ProxyTokenUpgradeForm tokenId={this.tokenId()} tokenData={tokenData}/>
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

