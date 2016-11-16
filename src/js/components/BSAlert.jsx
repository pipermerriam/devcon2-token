import React from 'react'


let Alert = React.createClass({
  getDefaultProps() {
    return {
      type: 'info',
      dismissable: false,
    }
  },
  renderDismissButton() {
    if (this.props.dismissable) {
      return (
        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      )
    } else {
      return null
    }
  },
  render() {
    return (
      <div className={`alert alert-${this.props.type}${this.props.dismissable ? ' alert-dismissable' : ''}`} role="alert">
        {this.renderDismissButton()}
        {this.props.children}
      </div>
    )
  },
})

let AlertHeading = React.createClass({
  render() {
    return (
      <h4 className="alert-heading">{this.props.children}</h4>
    )
  }
})

Alert.Heading = AlertHeading

export default Alert
