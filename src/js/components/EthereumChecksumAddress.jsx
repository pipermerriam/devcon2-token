import React from 'react'
import { connect } from 'react-redux'

export default connect((state) => state.web3)(React.createClass({
  propTypes: {
    address: React.PropTypes.string,
  },
  checksumAddress() {
    return this.props.web3.toChecksumAddress(this.props.address);
  },
  render() {
    return (
      <span className="ethereum-checksum-address"><code>{this.checksumAddress()}</code></span>
    );
  }
}));
