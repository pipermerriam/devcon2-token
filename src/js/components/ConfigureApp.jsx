import React from 'react'
import { connect } from 'react-redux'


function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(React.createClass({
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}))
