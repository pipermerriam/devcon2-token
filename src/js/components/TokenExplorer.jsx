import React from 'react'
import { connect } from 'react-redux'
import actions from '../actions'
import TokenTable from './TokenTable'
import TokenPaginator from './TokenPaginator'
import { getWeb3 } from '../services/web3'


function mapStateToExplorerProps(state) {
  return {
    ...state.tokens,
    ...state.web3,
  }
}


export default connect(mapStateToExplorerProps)(React.createClass({
  render() {
    if (this.props.web3 === null) {
      return (
        <div>
          Waiting for web3
        </div>
      );
    } else {
      return (
        <div>
          <TokenTable address={this.props.address} />
          <TokenPaginator paginatorKey={this.props.address} 
                          itemCount={this.props.tokenIds.length} />
        </div>
      );
    }
  }
}));
