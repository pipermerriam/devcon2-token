import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import actions from '../actions'
import LoadingSpinner from './LoadingSpinner'
import HideIfNoWeb3 from './HideIfNoWeb3'

export default function HideIfNoTokenContract(WrappedComponent) {
  return HideIfNoWeb3(connect(function(state) {
    return {
      '_tokenContractCode': state.tokens.contractCode
    }
  })(React.createClass({
    render() {
      if (this.props._tokenContractCode === null) {
        return <LoadingSpinner />
      } else if (this.props._tokenContractCode === '0x') {
        return <p>Token contract does not appear to be present on this chain</p>
      } else {
        return (
          <WrappedComponent {..._.omit(this.props, '_tokenContractCode')} />
        )
      }
    }
  })))
}
