import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import _ from 'lodash'
import actions from '../actions'
import TokenID from './TokenID'
import BSBreadcrumb from './BSBreadcrumb'
import BSAlert from './BSAlert'
import LoadingSpinner from './LoadingSpinner'
import EthereumAddress from './EthereumAddress'
import HideIfNoTokenContract from './HideIfNoTokenContract'
import YesNoWithIcon from './YesNoWithIcon'
import LoadingIfUndefined from './LoadingIfUndefined'

function mapStateToProps(state) {
  return {
    addressDetails: state.addresses.addressDetails,
    tokenDetails: state.tokens.tokenDetails,
  }
}

export default HideIfNoTokenContract(connect(mapStateToProps)(React.createClass({
  componentWillMount() {
    if (_.isEmpty(this.addressData())) {
      this.props.dispatch(actions.loadAddressData(this.address())).then(function() {
        let addressData = this.addressData()
        if (addressData.isTokenOwner) {
          this.props.dispatch(actions.loadTokenData(addressData.tokenId));
        }
      }.bind(this))
    }
  },
  address() {
    return this.props.params.address
  },
  addressData() {
    return this.props.addressDetails[this.address()]
  },
  tokenData() {
    return this.props.tokenDetails[this.addressData().tokenId]
  },
  renderUpgradeLink(tokenId, tokenData) {
    if (tokenData.isTokenUpgraded) {
      return null;
    } else {
      return (
        <span>
          <small>(<Link to={`/tokens/${tokenId}/upgrade`}>upgrade</Link>)</small>
        </span>
      )
    }
  },
  renderBody() {
    var addressData = this.addressData()
    if (_.isEmpty(addressData)) {
      return (
        <p><LoadingSpinner /> Loading owner information...</p>
      )
    } else if (addressData.isTokenOwner) {
      var tokenData = this.tokenData()
      if (_.isEmpty(tokenData)) {
        return <p><LoadingSpinner /> Loading token information ...</p>
      } else {
        return (
          <dl className="row">
            <dt className="col-sm-3">Token ID</dt>
            <dd className="col-sm-9">
              <Link to={`/tokens/${addressData.tokenId}`}>
                <TokenID tokenId={addressData.tokenId} length={null} />
              </Link>
            </dd>
            <dt className="col-sm-3">Has Been Upgraded</dt>
            <dd className="col-sm-9">
              <LoadingIfUndefined targetValue={tokenData}>
                <YesNoWithIcon yesOrNo={_.get(tokenData, 'isTokenUpgraded')} /> {this.renderUpgradeLink(addressData.tokenId, tokenData)}
              </LoadingIfUndefined>
            </dd>
          </dl>
        )
      }
    } else {
      return (
        <div className="row">
          <div className="col-sm-12">
            <BSAlert type="warning">The account <EthereumAddress address={this.address()} imageSize={12} /> is not a token owner</BSAlert>
          </div>
        </div>
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
              <BSBreadcrumb.Crumb crumbText="Address Details" />
            </BSBreadcrumb>
          </div>
        </div>
        <div className="row">
          <h2 className="col-sm-12"><EthereumAddress address={this.address()} imageSize={32} /></h2>
        </div>
        {this.renderBody()}
      </div>
    )
  }
})))
