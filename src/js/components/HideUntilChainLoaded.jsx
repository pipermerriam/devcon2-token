import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import actions from '../actions'
import LoadingSpinner from './LoadingSpinner'
import HideIfNoWeb3 from './HideIfNoWeb3'

function mapStateToProps(state) {
  return {
    '_chainIsLoaded': _.get(state.chain.metaData, 'isLoaded', false),
  }
}

export default function HideUntilChainLoaded(WrappedComponent) {
  return HideIfNoWeb3(connect(mapStateToProps)(React.createClass({
    componentWillMount() {
      if (!this.props._chainIsLoaded) {
        this.props.dispatch(actions.loadChainMetaData())
      }
    },
    render() {
      if (this.props._chainIsLoaded) {
        return (
          <WrappedComponent {..._.omit(this.props, '_chainIsLoaded')} />
        )
      } else {
        return <span><LoadingSpinner /> Waiting for chain to load.</span>
      }
    }
  })))
}
