import React from 'react'
import { connect } from 'react-redux'
import HideIfNoWeb3 from './HideIfNoWeb3'

function mapStateToProps(state) {
  return {
    web3: state.web3.web3,
  }
}

export default HideIfNoWeb3(connect(mapStateToProps)(React.createClass({
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
})));
