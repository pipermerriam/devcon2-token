import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import actions from '../actions'
import LoadingSpinner from './LoadingSpinner'


export default function HideIfNoWeb3(WrappedComponent) {
  return connect(function(state) {
    return {
      '_web3IsPresent': !_.isEmpty(state.web3.web3),
    }
  })(React.createClass({
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
        return <LoadingSpinner />
      }
    }
  }))
}
