import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import FAIcon from './FAIcon'
import LoadingSpinner from './LoadingSpinner'
import { CUSTOM, INFURA_MAINNET, INFURA_MORDEN, BROWSER } from '../services/web3'

function mapStateToProps(state) {
  return {
    isChainMetaLoaded: state.chain.metaData.isLoaded,
    isMainnet: state.chain.metaData.isMainnet,
    isMorden: state.chain.metaData.isMorden,
    selectedWeb3: _.get(state.web3, 'selectedWeb3', null),
    isConnected: _.get(state.web3, 'status.isConnected', null),
  }
}

export default connect(mapStateToProps)(React.createClass({
  componentWillMount() {
  },
  componentWillUnmount() {
  },
  refresh() {
  },
  isLoading() {
    return this.props.isConnected === null
  },
  renderChainDisplayName() {
    if (!this.props.isChainMetaLoaded) {
      return null
    } else if (this.props.isMainnet) {
      return '(mainnet)'
    } else if (this.props.isMorden) {
      return '(morden)'
    } else {
      return '(???)'
    }
  },
  getConnectionStatus() {
    if (this.props.isConnected === true) {
      return 'success'
    } else if (this.props.isConnected === false) {
      return 'danger'
    } else if (this.props.isConnected === null) {
      return 'muted'
    } else {
      throw "Invariant: This should never happen"
    }
  },
  renderBody() {
    if (this.isLoading()) {
      return <LoadingSpinner />
    } else {
      return (
        <span>
          <span className={`text-${this.getConnectionStatus()}`}><FAIcon icon="signal" /></span> {this.renderChainDisplayName()}
        </span>
      )
    }
  },
  render() {
    return (
      <span title="Web3 Connection Status">
        web3: {this.renderBody()}
      </span>
    )
  },
}))
