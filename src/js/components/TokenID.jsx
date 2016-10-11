import React from 'react'
import _ from 'lodash'

export default React.createClass({
  render() {
    return (
      <code title={this.props.tokenId}>
        {_.truncate(this.props.tokenId, {length: 9})}
      </code>
    );
  }
});
