import React from 'react'
import { connect } from 'react-redux';
import TokenTable from './TokenTable';
import { getWeb3 } from '../services/web3';


export default connect(state => state)(React.createClass({
  render() {
    var web3 = getWeb3();
    return (
      <div className="container">
        <div>Block {web3.eth.blockNumber}</div>
        <div className="row">
          <TokenTable address='0x0a43edfe106d295e7c1e591a4b04b5598af9474c' />
        </div>
      </div>
    );
  }
}));
