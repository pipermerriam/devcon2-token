import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import FAIcon from './FAIcon'
import Web3StatusIcon from './Web3StatusIcon'

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(React.createClass({
  render() {
    return (
      <nav id='top-nav' className='navbar navbar-dark bg-inverse'>
        <Link className='navbar-brand' to='/'>Devcon2 Token</Link>
        <div className="pull-xs-right">
          <ul className="nav navbar-nav">
            <li className="nav-item">
              <Link className='nav-link' to='/configure/web3'>
                <Web3StatusIcon />
              </Link>
            </li>
            <li className="nav-item">
              <Link className='nav-link' to='/configure'><FAIcon icon="gear" /> Config</Link>
            </li>
          </ul>
        </div>
      </nav>
    )
  },
}))
