import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import _ from 'lodash'
import actions from '../actions'
import TokenID from './TokenID'
import EthereumAddress from './EthereumAddress'
import HideIfNoTokenContract from './HideIfNoTokenContract'
import YesNoWithIcon from './YesNoWithIcon'
import LoadingIfUndefined from './LoadingIfUndefined'


function mapStateToProps(state) {
  return {
    addresses: state.addresses,
    tokens: state.tokens,
  }
}


export default HideIfNoTokenContract(connect(mapStateToProps)(React.createClass({
  componentWillMount() {
    if (_.isEmpty(this.addressData())) {
      this.props.dispatch(actions.loadAddressData(this.address()))
    }
  },
  address() {
    return this.props.params.address
  },
  addressData() {
    return this.props.addresses.addressDetails[this.address()]
  },
  tokenData() {
    return this.props.tokens.tokenDetails[this.addressData().tokenId]
  },
  renderBody() {
    var addressData = this.addressData()
    if (_.isEmpty(addressData)) {
      return (
        <p>Loading....</p>
      )
    } else if (addressData.isTokenOwner) {
      var tokenData = this.tokenData()
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
              <YesNoWithIcon yesOrNo={_.get(tokenData, 'isTokenUpgraded')} />
            </LoadingIfUndefined>
          </dd>
        </dl>
      )
    } else {
      return (
        <p>Not a token owner</p>
      )
    }
  },
  render() {
    return (
      <div>
        <div className="row">
          <h2 className="col-sm-12"><EthereumAddress address={this.address()} imageSize={32} /></h2>
        </div>
        {this.renderBody()}
      </div>
    )
  }
})))
