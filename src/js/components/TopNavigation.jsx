import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import FAIcon from './FAIcon'

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(React.createClass({
  render() {
    return (
      <nav id='top-nav' className='navbar navbar-dark bg-inverse'>
        <Link className='navbar-brand' to='/'>Devcon2 Token</Link>
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <Link className='nav-link' to='/configure'><FAIcon icon="gear" /></Link>
          </li>
        </ul>
      </nav>
    )
  },
}))
