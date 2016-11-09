import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import SyntaxHighlighter from "react-syntax-highlighter/dist/light"
import docco from 'react-syntax-highlighter/dist/styles/docco'; 
import { Field, reduxForm, formValueSelector } from 'redux-form';
import actions from '../actions'
import HideIfNoWeb3 from './HideIfNoWeb3'
import EthereumAddress from './EthereumAddress'
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
  setUpgradeParameters(formData) {
    this.props.dispatch(actions.updateTokenUpgradeParameters(this.props.tokenId, '0xC59162bbe31b2ECa8E3d7d3401DC05f64E293f83', this.props.tokenData.owner, formData.tokenRecipient))
  },
  submitUpgradeSignature(event) {
    var upgradeData = this.upgradeData()
    var upgradeParameters = this.upgradeParameters()
    this.props.dispatch(actions.submitProxyUpgrade(this.props.tokenId, upgradeParameters.currentOwner, upgradeParameters.tokenRecipient, upgradeData.signature))
  },
  getUpgradeParametersFormInitialValues() {
    return {
      contractAddress: "0xC59162bbe31b2ECa8E3d7d3401DC05f64E293f83",
      currentOwner: this.props.tokenData.owner,
      tokenRecipient: this.props.tokenData.owner,
    }
  },
  getSignatureFormInitialValues() {
    var signedBytes = _.get(this.upgradeData(), 'signedBytes', '')
    var bytesToSign = _.get(this.upgradeParameters(), 'bytesToSign')

    var signature = ''

    if (!_.isEmpty(bytesToSign) && bytesToSign === signedBytes) {
      signature = _.get(this.upgradeData, 'signature', '')
    }

    return {
      upgradeSignature: signature,
    }
  },
  upgradeData() {
    return _.get(
      this.props.tokens.upgradeData,
      this.props.tokenId,
      {},
    )
  },
  upgradeParameters() {
    return _.get(
      this.props.tokens.upgradeData,
      this.props.tokenId + '.upgradeParameters',
      {},
    )
  },
  render() {
    return (
      <div className="row">
        <h2 className="col-sm-12">Method #2: Proxy Upgrade</h2>
        <div className="col-sm-12">
          <p>This method involves submitting a cryptographic signature to the <code>proxyUpgrade()</code> function.</p>
        </div>
        <UpgradeParametersForm tokenData={this.props.tokenData} upgradeParameters={this.upgradeParameters()} initialValues={this.getUpgradeParametersFormInitialValues()} onSubmit={this.setUpgradeParameters} />
        <DataToSignCard tokenData={this.props.tokenData} upgradeParameters={this.upgradeParameters()} />
        <SignInBrowserCard tokenData={this.props.tokenData} upgradeParameters={this.upgradeParameters()} />
        <SignatureForm tokenData={this.props.tokenData} upgradeData={this.upgradeData()} upgradeParameters={this.upgradeParameters()} initialValues={this.getSignatureFormInitialValues()} onSubmit={this.submitUpgradeSignature} />
      </div>
    )
  },
})))


let UpgradeParametersForm = reduxForm({form: 'proxy-signature-parameters'})(connect(function(state) {
  return {
    tokenRecipient: formValueSelector('proxy-signature-parameters')(state, 'tokenRecipient'),
  }
})(React.createClass({
  render() {
    return (
      <div className="col-sm-12">
        <div className="card">
          <div className="card-header">
            <em>Step 1</em>: Upgrade Parameters
          </div>
          <div className="card-block">
            <form className="container clearfix" onSubmit={this.props.handleSubmit}>
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
                <label htmlFor="tokenRecipient" className="col-sm-2 col-form-label">New Owner</label>
                <div className="col-sm-10">
                  <Field component="input" type="text" className="form-control" name="tokenRecipient" placeholder="0x..." />
                  <p className="form-text text-muted">The address that will own the token after upgrading.</p>
                </div>
              </div>
              <div className="btn-group">
                <p>The upgraded token will be owned by <EthereumAddress address={this.props.tokenRecipient} imageSize={12} />.  Is this correct?</p>
                <button type="submit" className="btn btn-primary">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
})))

let DataToSignCard = React.createClass({
  signatureCodeBlock() {
    return `Data To Sign (hex encoded):\n${this.props.upgradeParameters.hexToSign}\n\nData Hash to Sign (hex encoded):\n${this.props.upgradeParameters.dataHash}`
  },
  gethConsoleCommand() {
    return `> web3.eth.sign("${this.props.upgradeParameters.tokenRecipient}", "${this.props.upgradeParameters.dataHash}")`
  },
  render() {
    if (_.isEmpty(_.get(this.props.upgradeParameters, 'tokenRecipient'))) {
      return null
    }
    return (
      <div className="col-sm-12">
        <div className="card">
          <div className="card-header">
            <em>Step 2</em>: Create Signature
          </div>
          <div className="card-block">
            <p>The following data needs to be signed by <EthereumAddress address={this.props.upgradeParameters.currentOwner} imageSize={12} />.</p>
            <SyntaxHighlighter language='javascript' style={docco}>{this.signatureCodeBlock()}</SyntaxHighlighter>
            <p>This data is the concatenated bytes of the following three values:</p>
            <ul>
              <li>Token contract address: <EthereumAddress address={this.props.upgradeParameters.tokenContractAddress} imageSize={12} /></li>
              <li>Current owner: <EthereumAddress address={this.props.upgradeParameters.currentOwner} imageSize={12} /></li>
              <li>Owner after upgrade: <EthereumAddress address={this.props.upgradeParameters.tokenRecipient} imageSize={12} /></li>
            </ul>
            <p>You can sign the data above with the following command using the <code>geth</code> console:</p>
            <SyntaxHighlighter language='javascript' style={docco}>{this.gethConsoleCommand()}</SyntaxHighlighter>
          </div>
        </div>
      </div>
    )
  }
})


let SignInBrowserCard = connect(function(state) {
  return {
    web3: state.web3,
  }
})(React.createClass({
  canSignLocally() {
    var web3 = this.props.web3.web3
    var address = web3.toChecksumAddress(this.props.tokenRecipient)
    return _.some(this.props.web3.accounts, function(account) {
      return (address === web3.toChecksumAddress(account))
    })
  },
  signData() {
    this.props.dispatch(actions.signTokenUpgradeData(
      this.props.tokenId,
      this.props.tokenData.owner,
      this.props.bytesToSign(),
    ))
  },
  render() {
    if (!this.canSignLocally()) {
      return null
    }
    return (
      <div className="col-sm-12">
        <div className="card">
          <div className="card-header">
            Sign In Browser
          </div>
          <div className="card-block">
            <p>It appears that the address <EthereumAddress address={this.props.upgradeParameters.currentOwner} imageSize={12} /> is available for use within your browser.</p>
            <div className="btn-group">
              <button type="button" className="btn btn-primary" onClick={signData}>Generate Signature</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}))

let SignatureForm = reduxForm({
  form: 'submit-proxy-upgrade-signature',
})(connect(function(state) {
  return {
    web3: state.web3,
    upgradeSignature: formValueSelector('submit-proxy-upgrade-signature')(state, 'upgradeSignature'),
  }
})(React.createClass({
  isReadyForSignature() {
    return !_.isEmpty(_.get(this.props.upgradeParameters, 'bytesToSign'))
  },
  isSignatureValid() {
    var signedBytes = _.get(this.props.upgradeData, 'signedBytes', '')
    var bytesToSign = _.get(this.props.upgradeParameters, 'bytesToSign')

    return (!_.isEmpty(this.props.upgradeSignature) && !_.isEmpty(bytesToSign) && bytesToSign === signedBytes)
  },
  render() {
    if (!this.isReadyForSignature()) {
      return null
    }
    return (
      <div className="col-sm-12">
        <div className="card">
          <div className="card-header">
            <em>Step 3:</em> Submit Signature
          </div>
          <div className="card-block">
            <form className="container" onSubmit={this.props.handleSubmit}>
              <p>Please paste the signature into the field below.</p>
              <div className="form-group">
              </div>
              <div className="form-group row">
                <label htmlFor="upgradeSignature" className="col-sm-2 col-form-label">Signature</label>
                <div className="col-sm-10">
                  <Field type="text" component="input" className="form-control" name="upgradeSignature" />
                  <p className="form-text text-muted">The 65 byte signature.</p>
                </div>
              </div>
              <div className="btn-group">
                <button type="submit" disabled={!this.isSignatureValid()} className="btn btn-primary">Submit Upgrade Transaction</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
})));
