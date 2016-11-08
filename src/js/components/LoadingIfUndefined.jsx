import React from 'react'
import LoadingSpinner from './LoadingSpinner'


export default React.createClass({
  render() {
    if (_.isUndefined(this.props.targetValue)) {
      return (
        <LoadingSpinner />
      )
    } else {
      return (
        <div>
          {this.props.children}
        </div>
      )
    }
  }
})
