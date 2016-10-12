import React from 'react'
import { connect } from 'react-redux'

import '../../css/layout'
import TopNavigation from './TopNavigation'


export default connect(state => state)(React.createClass({
  render() {
    return (
      <div className="container">
        <TopNavigation />
        {this.props.children}
      </div>
    )
  }
}))
