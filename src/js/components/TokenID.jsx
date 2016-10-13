import React from 'react'
import _ from 'lodash'

export default React.createClass({
  getDefaultProps() {
    return {
      length: 9,
    }
  },
  render() {
    if (_.isEmpty(this.props.length)) {
      return (
        <code>{this.props.tokenId}</code>
      )
    } else {
      return (
        <code title={this.props.tokenId}>
          {_.truncate(this.props.tokenId, {length: this.props.length})}
        </code>
      )
    }
  }
})
