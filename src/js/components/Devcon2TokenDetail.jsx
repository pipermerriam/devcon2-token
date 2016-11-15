import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import _ from 'lodash'
import actions from '../actions'
import BSBreadcrumb from './BSBreadcrumb'
import TokenID from './TokenID'
import EthereumAddress from './EthereumAddress'
import HideIfNoTokenContract from './HideIfNoTokenContract'
import YesNoWithIcon from './YesNoWithIcon'

export default HideIfNoTokenContract(connect((state) => state.tokens)(React.createClass({
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
  renderUpgradeLink(tokenData) {
    if (tokenData.isTokenUpgraded) {
      return null;
    } else {
      const tokenID = this.tokenID()
      return (
        <span>
          <small>(<Link to={`/tokens/${tokenID}/upgrade`}>upgrade</Link>)</small>
        </span>
      )
    }
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
          <dd className="col-sm-9">
            <Link to={`/addresses/${tokenData.owner}`}>
              <EthereumAddress address={tokenData.owner} imageSize={32} />
            </Link>
          </dd>
          <dt className="col-sm-3">Identity</dt>
          <dd className="col-sm-9"><pre><code>{tokenData.identity}</code></pre></dd>
          <dt className="col-sm-3">Has Been Upgraded</dt>
          <dd className="col-sm-9">
            <YesNoWithIcon yesOrNo={tokenData.isTokenUpgraded} />
            {this.renderUpgradeLink(tokenData)}
          </dd>
        </dl>
      )
    }
  },
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-sm-12">
            <BSBreadcrumb>
              <BSBreadcrumb.Crumb linkTo="/" crumbText="Home" />
              <BSBreadcrumb.Crumb linkTo="/tokens" crumbText="Token List" />
              <BSBreadcrumb.Crumb crumbText="Token Details" />
            </BSBreadcrumb>
          </div>
        </div>
        <div className="row">
          <h2 className="col-sm-12">Token Details</h2>
        </div>
        {this.renderBody()}
      </div>
    )
  }
})))
