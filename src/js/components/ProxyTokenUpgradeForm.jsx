import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import SyntaxHighlighter from "react-syntax-highlighter/dist/light"
import docco from 'react-syntax-highlighter/dist/styles/docco'; 
import { Field, reduxForm } from 'redux-form';
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
  componentWillMount() {
    if (this.props.accounts === null) {
      this.props.dispatch(actions.getWeb3AccountList())
    }
  },
  componentDidMount() {
    if (_.isEmpty(_.get(this.upgradeData(), 'dataHash', null))) {
      this.props.dispatch(actions.updateTokenUpgradeTarget(this.props.tokenId, this.upgradeTarget()))
    }
  },
  setSignatureParams(formData) {
    this.props.dispatch(actions.updateTokenUpgradeTarget(this.props.tokenId, formData.tokenOwner))
  },
  setUpgradeSignature(formData) {
    this.props.dispatch(actions.setTokenUpgradeSignature(this.props.tokenId, this.bytesToSign(), formData.upgradeSignature))
  },
  submitUpgradeSignature(event) {
    this.props.dispatch(actions.submitProxyUpgrade(this.props.tokenId, this.upgradeSignature()))
  },
  upgradeTarget() {
    return _.get(this.upgradeData(), 'target', this.props.tokenData.owner)
  },
  dataHash() {
    return _.get(this.upgradeData(), 'dataHash', '')
  },
  upgradeSignature() {
    return _.get(this.upgradeData(), 'signature', null)
  },
  upgradeSignedBytes() {
    return _.get(this.upgradeData(), 'signedBytes', null)
  },
  upgradeData() {
    return _.get(
      this.props.tokens.upgradeData,
      this.props.tokenId,
      {},
    )
  },
  isSigned() {
    return !_.isEmpty(this.upgradeSignature()) && this.upgradeSignedBytes() === this.bytesToSign()
  },
  bytesToSign() {
    var web3 = this.props.web3.web3
    return web3.toAscii('0xC59162bbe31b2ECa8E3d7d3401DC05f64E293f83') + web3.toAscii(this.props.tokenData.owner) + web3.toAscii(this.upgradeTarget())
  },
  hexToSign() {
    var web3 = this.props.web3.web3
    return web3.toHex(this.bytesToSign())
  },
  canSignLocally() {
    var web3 = this.props.web3.web3
    var address = web3.toChecksumAddress(this.props.tokenData.owner)
    return _.some(this.props.web3.accounts, function(account) {
      return (address === web3.toChecksumAddress(account))
    })
  },
  signatureParams() {
    return {
      contractAddress: "0xC59162bbe31b2ECa8E3d7d3401DC05f64E293f83",
      currentOwner: this.props.tokenData.owner,
      tokenOwner: this.upgradeTarget(),
    }
  },
  signData() {
    this.props.dispatch(actions.signTokenUpgradeData(
      this.props.tokenId,
      this.props.tokenData.owner,
      this.props.bytesToSign(),
    ))
  },
  renderLocalSignatureControls() {
    if (this.canSignLocally()) {
      return (
        <div>
          <h4>Sign In Browser</h4>
          <p>It looks like the account <EthereumChecksumAddress address={this.props.tokenData.owner} /> is available here in the browser.</p>
          <button className="btn btn-primary" type="button" onClick={this.signData}>Sign Data</button>
        </div>
      )
    } else {
      return null
    }
  },
  renderSignatureHeader() {
    if (this.isSigned()) {
      var web3 = this.props.web3.web3
      return (
        <div>
          <p>The following signature is ready to be submitted to the <code>proxyUpgrade()</code> function.</p>
          <SyntaxHighlighter language='javascript' style={docco}>{"Signed Data:\n" + web3.toHex(this.upgradeSignedBytes()) + "\n\nSignature:\n" + this.upgradeSignature()}</SyntaxHighlighter>
        </div>
      )
    } else {
      return (
        <div>
          <p>The following data needs to be signed by <EthereumChecksumAddress address={this.props.tokenData.owner} />.  The data is the concatenated bytes of:</p>
          <ul>
            <li>Token contract address: <EthereumChecksumAddress address="0xC59162bbe31b2ECa8E3d7d3401DC05f64E293f83" /></li>
            <li>Previous owner: <EthereumChecksumAddress address={this.props.tokenData.owner} /></li>
            <li>Owner after upgrade: <EthereumChecksumAddress address={this.upgradeTarget()} /></li>
          </ul>
          <SyntaxHighlighter language='javascript' style={docco}>{"Data To Sign (hex encoded):\n" + this.hexToSign()}</SyntaxHighlighter>
        </div>
      )
    }
  },
  renderSignatureControls() {
    if (this.isSigned()) {
      return (
        <button className="btn btn-primary" type="button" onClick={this.submitUpgradeSignature}>Submit</button>
      )
    } else {
      return (
        <div>
          {this.renderLocalSignatureControls()}
          <ManualSignatureForm tokenOwner={this.props.tokenData.owner} dataHash={this.dataHash()} onSubmit={this.setUpgradeSignature} />
        </div>
      )
    }
  },
  render() {
    return (
      <div className="row">
        <h2 className="col-sm-12">Method #2: Proxy Upgrade</h2>
        <p>This method involves submitting a cryptographic signature to the <code>proxyUpgrade()</code> function.</p>
        <SignatureParametersForm currentOwner={this.props.tokenData.owner} initialValues={this.signatureParams()} onSubmit={this.setSignatureParams} />
        {this.renderSignatureHeader()}
        {this.renderSignatureControls()}
      </div>
    )
  },
})))

let SignatureParametersForm = reduxForm({form: 'proxy-signature-parameters'})(React.createClass({
  render() {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <div className="row">
          <h4>Signature Parameters</h4>
        </div>
        <div className="form-group row">
          <label htmlFor="contractAddress" className="col-sm-2 col-form-label">Contract Address</label>
          <div className="col-sm-10">
            <Field component="input" type="text" readOnly="true" className="form-control" name="contractAddress" placeholder="0x..."/>
            <p className="form-text text-muted">The address of the upgraded token contract</p>
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="currentOwner" className="col-sm-2 col-form-label">Current Owner</label>
          <div className="col-sm-10">
            <Field component="input" type="text" readOnly="true" className="form-control" name="currentOwner" placeholder="0x..."/>
            <p className="form-text text-muted">The address that owns the token being upgraded in the old token contract.</p>
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="tokenOwner" className="col-sm-2 col-form-label">New Owner</label>
          <div className="col-sm-10">
            <Field component="input" type="text" className="form-control" name="tokenOwner" placeholder="0x..." />
            <p className="form-text text-muted">The address that will own the token after upgrading.</p>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Save</button>
      </form>
    )
  }
}))


let ManualSignatureForm = reduxForm({form: 'manual-signature'})(React.createClass({
  render() {
    return (
      <div>
        <h4>Sign Manually</h4>
        <p>You can sign the data above using the <code>geth</code> console:</p>
        <SyntaxHighlighter language='javascript' style={docco}>{'web3.eth.sign("' + this.props.tokenOwner + '", "' + this.props.dataHash + '")'}</SyntaxHighlighter>
        <form onSubmit={this.props.handleSubmit}>
          <div className="form-group">
            <label htmlFor="upgradeSignature" className="col-form-label">Signature</label>
            <Field type="text" component="input" className="form-control" name="upgradeSignature" />
          </div>
          <button className="btn btn-primary" type="submit">Save</button>
        </form>
      </div>
    )
  }
}));
