import React from 'react'
import { connect } from 'react-redux'

import '../../css/layout'
import TopNavigation from './TopNavigation'

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(React.createClass({
  render() {
    return (
      <div className="container">
        <TopNavigation />
        {this.props.children}
      </div>
    )
  }
}))
