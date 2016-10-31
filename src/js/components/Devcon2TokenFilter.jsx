import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import _ from 'lodash'
import actions from '../actions'


export default connect((state) => state.tokens)(React.createClass({
  componentWillMount() {
    if (_.isEmpty(this.props.addressLookup)) {
      this.props.dispatch(actions.loadAllAddresses());
    }
  },
  updateAddressFilter(event) {
    var addressFilter = event.target.value;
    this.props.dispatch(actions.setFilters({
      addressFilter: addressFilter,
    }));
  },
  render() {
    return (
      <div className="form-group row">
        <div className="col-sm-8 offset-sm-2">
          <input type="text" name="address" className="form-control" id="search-by-address" placeholder="address" onChange={this.updateAddressFilter} />
        </div>
      </div>
    );
  }
}));
