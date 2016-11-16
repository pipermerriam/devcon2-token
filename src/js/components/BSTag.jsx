import React from 'react'


export default React.createClass({
  getDefaultProps() {
    return {
      type: 'default',
      pill: false,
    }
  },
  render() {
    return (
      <span className={`tag ${this.props.pill ? 'tag-pill ' : ''}tag-${this.props.type}`}>{this.props.children}</span>
    )
  },
})
