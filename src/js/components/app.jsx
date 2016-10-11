import React from 'react'
import { connect } from 'react-redux'
import TokenExplorer from './TokenExplorer'
import TopNavigation from './TopNavigation'


export default connect(state => state)(React.createClass({
  render() {
    return (
      <div className="container">
        <TopNavigation />
        <div className="row">
          <div className="col-sm-12">
            <TokenExplorer address='0x0a43edfe106d295e7c1e591a4b04b5598af9474c' />
          </div>
        </div>
      </div>
    );
  }
}));
