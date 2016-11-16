import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import _ from 'lodash'
import actions from '../actions'
import BSCard from './BSCard'
import BSBreadcrumb from './BSBreadcrumb'
import BSAlert from './BSAlert'
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
  renderBreadcrumbs() {
    return (
      <div className="row">
        <div className="col-sm-12">
          <BSBreadcrumb>
            <BSBreadcrumb.Crumb linkTo="/" crumbText="Home" />
            <BSBreadcrumb.Crumb linkTo="/tokens" crumbText="Token List" />
            <BSBreadcrumb.Crumb linkTo={`/tokens/${this.tokenId()}`} crumbText="Token Details" />
            <BSBreadcrumb.Crumb crumbText="Upgrade" />
          </BSBreadcrumb>
        </div>
      </div>
    )
  },
  renderAlreadyUpgraded(upgradeData) {
    const tokenId = this.tokenId()
    if (_.isEmpty(_.get(upgradeData, 'transactionHashes', []))) {
      return (
        <div>
          {this.renderBreadcrumbs()}
          <div className="row">
            <div className="col-sm-12">
              <BSAlert type="info">
                <p>Token has already been upgraded.  <Link to={`/tokens/${tokenId}`}>Back to token details...</Link></p>
              </BSAlert>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          {this.renderBreadcrumbs()}
          <div className="row">
            <div className="col-sm-12">
              <BSAlert type="success">
                <p>Token has been upgraded.  <Link to={`/tokens/${tokenId}`}>Back to token details...</Link></p>
              </BSAlert>
            </div>
          </div>
        </div>
      )
    }
  },
  renderUpgradeForm(tokenData, upgradeData) {
    return (
      <div>
        {this.renderBreadcrumbs()}
        <div className="row">
          <h1 className="col-sm-12">Upgrading Token: <TokenID tokenId={this.tokenId()} length={20} /></h1>
          <div className="col-sm-12">
            <p>The original Devcon2 token contract has a few warts related to ERC20 compliance.</p>
            <ul>
              <li>Account balances were represented as gigantic numbers</li>
              <li>Transfering your token to a new owner required transfering that gigantic number of tokens despite the fact that it really only transfers one.</li>
            </ul>
            <p>In order to fix these issues a new contract has been deployed which fixes these issues.</p>
            <ul>
              <li>Account balances are now always 1 or 0 depending on if the account is a token owner.</li>
              <li>Transfering your token is now done by just transfering your 1 token.</li>
            </ul>
            <p>Upgrading your token can be done in one of <em>two</em> ways</p>
            <ol>
              <li><strong>Direct Upgrade:</strong> send a transaction that calls the <code>upgrade()</code> function.  This transaction <strong>must</strong> be sent from the current owner of the token in the old Devcon2 token contract.</li>
              <li><strong>Proxy Upgrade:</strong> send a transaction which includes a cryptographic signature from the current Devcon2 token owner that calls the <code>proxyUpgrade()</code> function.  This transaction can be sent from any account.</li>
            </ol>
          </div>
        </div>
        <a name="direct-upgrade" />
        <DirectTokenUpgradeForm tokenId={this.tokenId()} tokenData={tokenData}/>
        <a name="proxy-upgrade" />
        <ProxyTokenUpgradeForm tokenId={this.tokenId()} tokenData={tokenData}/>
        <div className="row">
          <div className="col-sm-12">
            <a name="transaction-list" />
            <BSCard>
              <TransactionTable tokenId={this.tokenId()} transactions={_.get(upgradeData, 'transactionHashes', [])} />
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
      return (
        <div>
          {this.renderBreadcrumbs()}
          <div className="row">
            <div className="col-sm-12">
              <LoadingSpinner /> Loading token data...
            </div>
          </div>
        </div>
      )
    } else if (tokenData.isTokenUpgraded) {
      return this.renderAlreadyUpgraded(upgradeData)
    } else {
      return this.renderUpgradeForm(tokenData, upgradeData)
    }
  }
})))

