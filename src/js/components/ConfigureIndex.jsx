import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import BSBreadcrumb from './BSBreadcrumb'

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
              <BSBreadcrumb.Crumb crumbText="Configuration" />
            </BSBreadcrumb>
          </div>
        </div>
        <div className="row">
          <h2 className="col-sm-12">Configuration</h2>
        </div>
        <div className="row">
          <div className="list-group col-sm-12">
            <div className="list-group-item list-group-item-action container">
              <div className="row">
                <div className="col-sm-9">
                  <h5 className="list-group-item-heading">Web3</h5>
                  <p className="list-group-item-text">Configure how the application connects to the Ethereum blockchain.</p>
                </div>
                <div className="col-sm-3 text-xs-right">
                  <Link to="configure/web3" className="btn btn-primary">Configure</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}))
