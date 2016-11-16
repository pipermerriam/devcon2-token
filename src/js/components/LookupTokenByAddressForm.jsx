import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form';
import actions from '../actions'

function mapStateToProps(state) {
  return {}
}

export default reduxForm({
  form: 'lookup-token-by-address',
})(connect(mapStateToProps)(React.createClass({
  render() {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <div className="form-group">
          <label htmlFor="tokenOwnerAddress">Ethereum Address</label>
          <Field type="text" component="input" className="form-control" name="tokenOwnerAddress" aria-describedby="tokenOwnerAddressHelp" placeholder="0x...." />
          <small name="tokenOwnerAddressHelp" className="form-text text-muted">The ethereum address that owns your token.</small>
        </div>
        <button type="submit" className="btn btn-primary">Search</button>
      </form>
    )
  }
})))
