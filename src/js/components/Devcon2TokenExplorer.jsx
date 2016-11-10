import React from 'react'
import { connect } from 'react-redux'
import actions from '../actions'
import Devcon2TokenTable from './Devcon2TokenTable'
import HideIfNoTokenContract from './HideIfNoTokenContract'

function mapStateToExplorerProps(state) {
  return {
    tokenContractAddress: state.config.INDIVIDUALITY_TOKEN_ROOT_CONTRACT_ADDRESS,
    ...state.tokens,
    ...state.web3,
  }
}

export default HideIfNoTokenContract(connect(mapStateToExplorerProps)(React.createClass({
  render() {
    return (
      <div>
        <Devcon2TokenTable paginatorKey={this.tokenContractAddress}
                           items={this.props.tokenIds} />
      </div>
    )
  },
})))
