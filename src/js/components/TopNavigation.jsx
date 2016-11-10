import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import _ from 'lodash'
import actions from '../actions'

function mapStateToProps(state) {
  return {
    chainMeta: state.chain.metaData,
    ...state.web3,
  }
}

export default connect(mapStateToProps)(React.createClass({
  componentWillMount() {
    if (this.props.web3Options === null) {
      this.props.dispatch(actions.initializeWeb3())
    }
  },
  updateWeb3(event) {
    this.props.dispatch(actions.selectWeb3(event.target.value))
  },
  renderCurrentChain() {
    if (this.props.web3 === null) {
      return null
    }
    if (this.props.chainMeta.isMainnet) {
      return (
        <span className="navbar-text"><strong>Chain:</strong> Mainnet</span>
      )
    } else if (this.props.chainMeta.isMorden) {
      return (
        <span className="navbar-text"><strong>Chain:</strong> Morden</span>
      )
    } else {
      return (
        <span className="navbar-text"><strong>Chain:</strong> Unknown</span>
      )
    }
  },
  renderWeb3Select() {
    if (this.props.web3Options === null) {
      return null
    } else {
      return (
        <div className='form-inline'>
          <div className='form-group'>
            <label htmlFor='web3-connection'>Web3 Connection</label>
            <select className='form-control' id='web3-connection' defaultValue={this.props.selectedWeb3} onChange={this.updateWeb3}>
              {_.map(this.props.web3Options, _.spread(function(display, choice) {
                return (
                  <option value={choice} key={choice}>{display}</option>
                )
              }))}
            </select>
          </div>
        </div>
      )
    }
  },
  render() {
    return (
      <nav id='top-nav' className='navbar navbar-dark bg-inverse'>
        {this.renderCurrentChain()}
        <Link className='navbar-brand' to='/'>Devcon2 Tokens</Link>
        <div className='pull-xs-right'>
          {this.renderWeb3Select()}
        </div>
      </nav>
    )
  },
}))
