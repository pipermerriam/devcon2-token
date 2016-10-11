import React from 'react'
import { connect } from 'react-redux';
import actions from '../actions';


export default connect((state) => state.tokens)(React.createClass({
  componentWillMount() {
    if (this.props.loaded === false) {
      this.props.dispatch(actions.loadTokens());
    }
  },
  render() {
    return (
      <table className="table">
        <thead>
          <tr>
            <th>TokenID</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          {this.props.tokenIds.map((tokenId) => (
            <TokenTableRow tokenId={tokenId} key={tokenId} />
          ))}
        </tbody>
      </table>
    );
  }
}));


let TokenTableRow = connect((state) => state.tokens)(React.createClass({
  componentWillMount() {
    if (this.props.tokens[this.props.tokenId] === undefined) {
      this.props.dispatch(actions.loadTokenData(this.props.tokenId));
    }
  },
  render() {
    var tokenData = this.props.tokens[this.props.tokenId];
    if (tokenData === undefined) {
      return (
        <tr>
          <td colSpan="2">Loading data for <code>{this.props.tokenId}</code></td>
        </tr>
      )
    } else {
      return (
        <tr>
          <td>
            {this.props.tokenId}
          </td>
          <td>
            {tokenData.owner}
          </td>
        </tr>
      );
    }
  }
}));
