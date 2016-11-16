import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import actions from '../actions/index'
import BSBreadcrumb from './BSBreadcrumb'
import BSTag from './BSTag'
import { BROWSER, CUSTOM, DEFAULT_LOCALHOST_RPCHOST, INFURA_MAINNET, INFURA_MORDEN } from '../services/web3'

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(React.createClass({
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-sm-12">
            <BSBreadcrumb>
              <BSBreadcrumb.Crumb linkTo="/" crumbText="Home" />
              <BSBreadcrumb.Crumb linkTo="/configure" crumbText="Configure" />
              <BSBreadcrumb.Crumb crumbText="Web3" />
            </BSBreadcrumb>
          </div>
        </div>
        <div className="row">
          <h2 className="col-sm-12">Configure Web3 Connection</h2>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <ConfigureBrowserWeb3 />
            <ConfigureInfuraWeb3 />
            <ConfigureCustomWeb3 />
          </div>
        </div>
      </div>
    )
  }
}))

function mapStateToConfigureCustomWeb3Props(state) {
  return {
    config: _.get(state.web3.config, CUSTOM, {}),
    selectedWeb3: state.web3.selectedWeb3,
  }
}

let ConfigureCustomWeb3 = connect(mapStateToConfigureCustomWeb3Props)(React.createClass({
  isSelected() {
    return this.props.selectedWeb3 === CUSTOM
  },
  isAvailable() {
    return true
  },
  handleRPCHostChange(event) {
    this.props.dispatch(actions.updateWeb3Config(CUSTOM, {rpcHost: event.target.value}))
  },
  handleSelect() {
    this.props.dispatch(actions.selectWeb3(CUSTOM))
  },
  renderSelectedTag() {
    if (this.isSelected()) {
      return <BSTag type="success">Selected</BSTag>
    } else {
      return null
    }
  },
  render() {
    return (
      <div className="list-group-item list-group-item-action container">
        <div className="row">
          <div className="col-sm-9">
            <h5 className="list-group-item-heading">Custom {this.renderSelectedTag()}</h5>
            <p className="list-group-item-text">Manually configure the web3 connection.</p>
            <div className="form-group">
              <label htmlFor="customWeb3Host">RPC Host</label>
              <input name="customWeb3Host" type="text" className="form-control" placeholder="localhost:8545" defaultValue={_.get(this.props.config, 'rpcHost', DEFAULT_LOCALHOST_RPCHOST)} onChange={this.handleRPCHostChange} />
            </div>
          </div>
          <div className="col-sm-3 text-xs-right">
            <button type="button" disabled={this.isSelected() || !this.isAvailable()} className={`btn btn-${this.isSelected() ? 'success' : 'primary'}`}onClick={this.handleSelect} >Select</button>
          </div>
        </div>
      </div>
    )
  }
}))

function mapStateToConfigureInfuraWeb3Props(state) {
  return {
    selectedWeb3: state.web3.selectedWeb3,
  }
}

let ConfigureInfuraWeb3 = connect(mapStateToConfigureCustomWeb3Props)(React.createClass({
  isMainnetSelected() {
    return this.props.selectedWeb3 === INFURA_MAINNET
  },
  isMordenSelected() {
    return this.props.selectedWeb3 === INFURA_MORDEN
  },
  isEitherSelected() {
    return this.isMainnetSelected() || this.isMordenSelected()
  },
  isAvailable() {
    return true
  },
  handleSelectMainnet() {
    this.props.dispatch(actions.selectWeb3(INFURA_MAINNET))
  },
  handleSelectMorden() {
    this.props.dispatch(actions.selectWeb3(INFURA_MORDEN))
  },
  renderSelectedTag() {
    if (this.isEitherSelected()) {
      return <BSTag type="success">Selected</BSTag>
    } else {
      return null
    }
  },
  render() {
    return (
      <div className="list-group-item list-group-item-action container">
        <div className="row">
          <div className="col-sm-8">
            <h5 className="list-group-item-heading">Infura {this.renderSelectedTag()}</h5>
            <p className="list-group-item-text">Connect web3 to <a href="https://infura.io/" target="_blank">Infura</a></p>
          </div>
          <div className="col-sm-4 text-xs-right">
            <div className="btn-group" role="group" aria-label="Basic example">
              <button type="button" className={`btn btn-${this.isMainnetSelected() ? 'success' : 'primary'}`} disabled={this.isMainnetSelected() || !this.isAvailable()} onClick={this.handleSelectMainnet}>Infura (Mainnet)</button>
              <button type="button" className={`btn btn-${this.isMordenSelected() ? 'success' : 'primary'}`}disabled={this.isMordenSelected() || !this.isAvailable()} onClick={this.handleSelectMorden}>Infura (Morden)</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}))

function mapStateToConfigureBrowserWeb3Props(state) {
  return {
    selectedWeb3: state.web3.selectedWeb3,
    isBrowserAvailable: state.web3.isBrowserAvailable,
  }
}

let ConfigureBrowserWeb3 = connect(mapStateToConfigureCustomWeb3Props)(React.createClass({
  isSelected() {
    return this.props.selectedWeb3 === BROWSER
  },
  isAvailable() {
    return this.props.isBrowserAvailable
  },
  handleSelect() {
    this.props.dispatch(actions.selectWeb3(BROWSER))
  },
  renderSelectedTag() {
    if (this.isSelected()) {
      return <BSTag type="success">Selected</BSTag>
    } else {
      return null
    }
  },
  renderName() {
    if (this.props.isBrowserAvailable === true) {
      if (window !== undefined && window.web3 !== undefined) {
        const providerName = _.get(web3, 'currentProvider.constructor.name')
        const isMetamask = _.startsWith(providerName, 'Metamask')
        return isMetamask ? 'Metamask' : 'Browser'
      }
    } else {
      return 'Browser'
    }
  },
  renderButtonText() {
    if (this.isAvailable() || this.isSelected()) {
      return "Select"
    } else {
      return "No Web3 Found In Browser"
    }
  },
  render() {
    return (
      <div className="list-group-item list-group-item-action container">
        <div className="row">
          <div className="col-sm-8">
            <h5 className="list-group-item-heading">{this.renderName()} {this.renderSelectedTag()}</h5>
            <p className="list-group-item-text">Use a <code>web3</code> instance that is available in your browser (such as <a href="https://metamask.io/" target="_blank">Metamask</a>)</p>
          </div>
          <div className="col-sm-4 text-xs-right">
            <button type="button" disabled={this.isSelected() || !this.isAvailable()} className={`btn btn-${this.isSelected() ? 'success' : 'primary'}`}onClick={this.handleSelect} >{this.renderButtonText()}</button>
          </div>
        </div>
      </div>
    )
  }
}))
