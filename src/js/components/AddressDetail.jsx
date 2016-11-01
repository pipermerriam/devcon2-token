import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import actions from '../actions'
import TokenID from './TokenID'
import EthereumAddress from './EthereumAddress'
import HideIfNoWeb3 from './HideIfNoWeb3'


export default HideIfNoWeb3(connect((state) => state.addresses)(React.createClass({
  componentWillMount() {
    if (_.isEmpty(this.addressData())) {
      this.props.dispatch(actions.loadAddressData(this.address()))
    }
  },
  address() {
    return this.props.params.address
  },
  addressData() {
    return this.props.addressDetails[this.address()]
  },
  renderBody() {
    var addressData = this.addressData()
    if (_.isEmpty(addressData)) {
      return (
        <p>Loading....</p>
      )
    } else if (addressData.isTokenOwner) {
      return (
        <dl className="row">
          <dt className="col-sm-3">Token ID</dt>
          <dd className="col-sm-9"><TokenID tokenId={addressData.tokenId} length={null} /></dd>
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
