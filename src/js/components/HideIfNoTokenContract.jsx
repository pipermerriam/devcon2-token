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
        console.log('HIDEING because code is null')
        return <LoadingSpinner />
      } else if (this.props._tokenContractCode === '0x') {
        console.log('HIDEING because code is 0x')
        return <p>Token contract does not appear to be present on this chain</p>
      } else {
        console.log('SHOWING because code is here')
        return (
          <WrappedComponent {..._.omit(this.props, '_tokenContractCode')} />
        )
      }
    }
  })))
}
