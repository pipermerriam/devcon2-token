import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import _ from 'lodash'
import actions from '../actions'
import BSCard from './BSCard'
import TokenID from './TokenID'
import HideIfNoTokenContract from './HideIfNoTokenContract'
import LoadingSpinner from './LoadingSpinner'
import DirectTokenUpgradeForm from './DirectTokenUpgradeForm'
import ProxyTokenUpgradeForm from './ProxyTokenUpgradeForm'
import TransactionTable from './TransactionTable'

function mapStateToProps(state) {
  return state.tokens
}

export default HideIfNoTokenContract(connect(mapStateToProps)(React.createClass({
  componentWillMount() {
    if (_.isEmpty(this.tokenData())) {
      this.props.dispatch(actions.loadTokenData(this.tokenId()))
    }
  },
  tokenId() {
    return this.props.params.id
  },
  tokenData() {
    return _.get(this.props.tokenDetails, this.tokenId())
  },
  upgradeData() {
    return _.get(this.props.upgradeData, this.tokenId(), {})
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
  renderUpgradeForm(tokenData, upgradeData) {
    return (
      <div>
        <h1>Upgrading Token: <TokenID tokenId={this.tokenId()} /></h1>
        <DirectTokenUpgradeForm tokenId={this.tokenId()} tokenData={tokenData}/>
        <ProxyTokenUpgradeForm tokenId={this.tokenId()} tokenData={tokenData}/>
        <div className="row">
          <div className="col-sm-12">
            <BSCard>
              <TransactionTable transactions={_.get(upgradeData, 'transactionHashes', [])} />
            </BSCard>
          </div>
        </div>
      </div>
    )
  },
  render() {
    const tokenData = this.tokenData()
    const upgradeData = this.upgradeData()
    if (_.isEmpty(tokenData)) {
      return <LoadingSpinner />
    } else if (tokenData.isTokenUpgraded) {
      return this.renderAlreadyUpgraded()
    } else {
      return this.renderUpgradeForm(tokenData, upgradeData)
    }
  }
})))

