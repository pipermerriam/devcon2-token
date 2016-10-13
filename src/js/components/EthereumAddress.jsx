import React from 'react'
import EthereumAddressIcon from './EthereumAddressIcon'
import EthereumChecksumAddress from './EthereumChecksumAddress'
import '../../css/ethereum-address'


export default React.createClass({
  getDefaultProps() {
    return {
      imageSize: 64,
    };
  },
  propTypes: {
    address: React.PropTypes.string,
    imageSize: React.PropTypes.number,
  },
  render() {
    return (
      <div className="ethereum-address">
        <EthereumAddressIcon address={this.props.address} imageSize={this.props.imageSize} />
        <EthereumChecksumAddress address={this.props.address} />
        <div className="clearfix"></div>
      </div>
    );
  }
});
