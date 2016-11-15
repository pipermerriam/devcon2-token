import React from 'react'
import { Link } from 'react-router'


let Breadcrumb = React.createClass({
  render() {
    return (
      <ol className="breadcrumb">
        {this.props.children}
      </ol>
    )
  },
})

let Crumb = React.createClass({
  getDefaultProps() {
    return {
      active: false,
    }
  },
  render() {
    let classes = ["breadcrumb-item"]
    if (this.props.active) {
      classes.push("active")
    }
    if (_.isEmpty(this.props.linkTo)) {
      return (
        <li className={classes.join(' ')}>{this.props.crumbText}</li>
      )
    } else {
    }
    return (
      <li className={classes.join(' ')}><Link to={this.props.linkTo}>{this.props.crumbText}</Link></li>
    )
  }
})

Breadcrumb.Crumb = Crumb

export default Breadcrumb
