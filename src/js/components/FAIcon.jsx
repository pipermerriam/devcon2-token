import React from 'react'

export default React.createClass({
  getDefaultProps() {
    return {spin: false}
  },
  getClasses() {
    let classes = ['fa']
    classes.push(`fa-${this.props.icon}`)
    if (this.props.spin) {
      classes.push('fa-spin')
    }
    return classes
  },
  render() {
    return (
      <i className={this.getClasses().join(' ')}></i>
    )
  }
})
