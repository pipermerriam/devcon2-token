import React from 'react'


export default React.createClass({
  render() {
    if (_.isUndefined(this.props.targetValue)) {
      return (
        <i className="fa fa-spinner fa-spin"></i>
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
