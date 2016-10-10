import React from 'react'
import { connect } from 'react-redux';
import TokenTable from './TokenTable';


export default connect(state => state)(React.createClass({
  render() {
    return (
      <div className="container">
        <div className="row">
          <TokenTable address='0x0a43edfe106d295e7c1e591a4b04b5598af9474c' />
        </div>
      </div>
    );
  }
}));
