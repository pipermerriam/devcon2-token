import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'


export default function HideIfNoWeb3(WrappedComponent) {
  return connect(function(state) {
    return {
      'web3': state.web3.web3,
    }
  })(React.createClass({
    render() {
      if (_.isEmpty(this.props.web3)) {
        return null;
      } else {
        return (
          <WrappedComponent {..._.omit(this.props, 'web3')} />
        )
      }
    }
  }))
}
