import React from 'react'
import { connect } from 'react-redux'
import actions from '../actions'
import Devcon2TokenTable from './Devcon2TokenTable'
import { getWeb3 } from '../services/web3'
import HideIfNoWeb3 from './HideIfNoWeb3'

function mapStateToExplorerProps(state) {
  return {
    ...state.tokens,
    ...state.web3,
  }
}

const DEVCON2_TOKEN_ADDRESS = '0x0a43edfe106d295e7c1e591a4b04b5598af9474c'

export default HideIfNoWeb3(connect(mapStateToExplorerProps)(React.createClass({
  render() {
    return (
      <div>
        <Devcon2TokenTable paginatorKey={DEVCON2_TOKEN_ADDRESS}
                           items={this.props.tokenIds} />
      </div>
    )
  },
})))
