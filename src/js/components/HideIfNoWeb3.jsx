import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import actions from '../actions'
import LoadingSpinner from './LoadingSpinner'

function mapStateToProps(state) {
  return {
    '_web3IsPresent': !_.isEmpty(state.web3.web3),
  }
}

export default function HideIfNoWeb3(WrappedComponent) {
  return connect(mapStateToProps)(React.createClass({
    componentWillMount() {
      if (!this.props._web3IsPresent) {
        this.props.dispatch(actions.initializeWeb3())
      }
    },
    render() {
      if (this.props._web3IsPresent) {
        return (
          <WrappedComponent {..._.omit(this.props, '_web3IsPresent')} />
        )
      } else {
        return <span><LoadingSpinner /> Waiting for web3 connection</span>
      }
    }
  }))
}
