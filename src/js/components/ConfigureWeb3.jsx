import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import BSBreadcrumb from './BSBreadcrumb'

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(React.createClass({
  //componentWillMount() {
  //  if (this.props.web3Options === null) {
  //    this.props.dispatch(actions.initializeWeb3())
  //  }
  //},
  //updateWeb3(event) {
  //  this.props.dispatch(actions.selectWeb3(event.target.value))
  //},
  //renderCurrentChain() {
  //  if (this.props.web3 === null) {
  //    return null
  //  }
  //  if (this.props.chainMeta.isMainnet) {
  //    return (
  //      <span className="navbar-text"><strong>Chain:</strong> Mainnet</span>
  //    )
  //  } else if (this.props.chainMeta.isMorden) {
  //    return (
  //      <span className="navbar-text"><strong>Chain:</strong> Morden</span>
  //    )
  //  } else {
  //    return (
  //      <span className="navbar-text"><strong>Chain:</strong> Unknown</span>
  //    )
  //  }
  //},
  //renderWeb3Select() {
  //  if (this.props.web3Options === null) {
  //    return null
  //  } else {
  //    return (
  //      <div className='form-inline'>
  //        <div className='form-group'>
  //          <label htmlFor='web3-connection'>Web3 Connection</label>
  //          <select className='form-control' id='web3-connection' defaultValue={this.props.selectedWeb3} onChange={this.updateWeb3}>
  //            {_.map(this.props.web3Options, _.spread(function(display, choice) {
  //              return (
  //                <option value={choice} key={choice}>{display}</option>
  //              )
  //            }))}
  //          </select>
  //        </div>
  //      </div>
  //    )
  //  }
  //},
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
            <ConfigureWeb3Custom />
          </div>
        </div>
      </div>
    )
  }
}))

function mapStateToConfigureWeb3Props(state) {
  return {
    web3: state.web3,
    chain: state.chain,
  }
}

let ConfigureWeb3Custom = connect(mapStateToConfigureWeb3Props)(React.createClass({
  isSelected() {
    return false
  },
  isAvailable() {
    return true
  },
  render() {
    return (
      <div className="list-group-item list-group-item-action container">
        <div className="row">
          <div className="col-sm-9">
            <h5 className="list-group-item-heading">Custom</h5>
            <p className="list-group-item-text">Manually configure the web3 connection.</p>
            <div className="form-group">
              <label htmlFor="customWeb3Host">RPC Host</label>
              <input name="customWeb3Host" type="text" className="form-control" placeholder="localhost:8545" defaultValue="localhost:8545" />
              </div>
          </div>
          <div className="col-sm-3 text-xs-right">
            <button type="button" disabled={this.isSelected() && !this.isAvailable()} className="btn btn-primary">Select</button>
          </div>
        </div>
      </div>
    )
  }
}))
