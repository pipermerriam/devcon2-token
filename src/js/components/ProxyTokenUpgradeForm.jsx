import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import actions from '../actions'
import HideIfNoWeb3 from './HideIfNoWeb3'
import EthereumChecksumAddress from './EthereumChecksumAddress'
import LoadingSpinner from './LoadingSpinner'

function mapStateToProps(state) {
  return {
    web3: state.web3,
    tokens: state.tokens,
  }
}

export default HideIfNoWeb3(connect(mapStateToProps)(React.createClass({
  setUpgradeTarget(event) {
    this.props.dispatch(actions.setTokenUpgradeTarget(this.props.tokenId, event.target.value))
  },
  upgradeAddress() {
    return _.get(this.props.upgradeTarget, this.props.tokenId, this.props.tokenData.owner)
  },
  bytesToSign() {
    var web3 = this.props.web3.web3
    return web3.toAscii('0xC59162bbe31b2ECa8E3d7d3401DC05f64E293f83') + web3.toAscii(this.props.tokenData.owner) + web3.toAscii(this.upgradeAddress())
  },
  hexToSign() {
    var web3 = this.props.web3.web3
    return web3.toHex(this.bytesToSign())
  },
  signData() {
    var web3 = this.props.web3.web3
    web3.eth.sign(this.props.web3.accounts[0], web3.sha3(this.bytesToSign()), function(err, result) {
      if (!err) {
        alert(result)
      } else {
        alert(err)
      }
    })
  },
  render() {
    return (
      <div>
        <div className="row">
          <h2 className="col-sm-12">Method #2: Proxy Upgrade</h2>
          <p>This method involves submitting a cryptographic signature the <code>proxyUpgrade()</code> function.</p>
          <p>Please sign the following value using the private key for the account <EthereumChecksumAddress address={this.props.tokenData.owner} /></p>
        </div>
        <div className="form-group row">
          <label htmlFor="contractAddress" className="col-sm-2 col-form-label">Contract Address</label>
          <div className="col-sm-10">
            <input type="text" readOnly="true" className="form-control" id="contractAddress" placeholder="0x..." value="0xC59162bbe31b2ECa8E3d7d3401DC05f64E293f83" />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="currentOwner" className="col-sm-2 col-form-label">Current Owner</label>
          <div className="col-sm-10">
            <input type="text" readOnly="true" className="form-control" id="currentOwner" placeholder="0x..." value={this.props.tokenData.owner} />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="tokenOwner" className="col-sm-2 col-form-label">New Owner</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" id="tokenOwner" placeholder="0x..." defaultValue={this.upgradeAddress()} onChange={this.setUpgradeTarget}/>
          </div>
        </div>
        <ul>
          <li>Hex Encoded: <code>{this.hexToSign()}</code></li>
        </ul>
        <button className="btn btn-primary" type="button" onClick={this.signData}>Sign</button>
      </div>
    )
  },
})))
