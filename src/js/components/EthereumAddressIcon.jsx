import React from 'react'
import Blockies from '../vendor/blockies'
import '../../css/ethereum-address.css'

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
    var imgURL = Blockies.create({
      seed: this.props.address,
      size: 8,
      scale: 16,
    }).toDataURL();
    var style = {
      backgroundImage: 'url(' + imgURL + ')',
      width: this.props.imageSize + 'px',
      height: this.props.imageSize + 'px',
    };

    return (
      <div className="ethereum-address-icon" style={style} />
    );
  }
});
