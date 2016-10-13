import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import actions from '../actions'
import TokenID from './TokenID'
import EthereumAddress from './EthereumAddress'


function mapStateToTokenTableProps(state) {
  return {
    ...state.tokens,
    ...state.pagination,
  };
}


export default connect(mapStateToTokenTableProps)(React.createClass({
  getDefaultProps() {
    return {
      address: '0x0a43edfe106d295e7c1e591a4b04b5598af9474c',
    }
  },
  paginator() {
    return this.props.paginators[this.props.address];
  },
  pageNumber() {
    return _.get(this.paginator(), 'pageNumber', 1);
  },
  pageSize() {
    return _.get(this.paginator(), 'pageSize', 10);
  },
  idxOffset() {
    return (this.pageNumber() - 1) * this.pageSize();
  },
  tokenSlice() {
    var leftBound = this.idxOffset();
    var rightBound = leftBound + this.pageSize();
    return _.slice(this.props.tokenIds, leftBound, rightBound);
  },
  renderRows() {
    var idxOffset = this.idxOffset();
    return _.map(this.tokenSlice(), function(tokenId, idx) {
      return (
        <TokenTableRow tokenIdx={idxOffset + idx + 1}
                        tokenId={tokenId}
                        key={tokenId} />
      );
    });
  },
  render() {
    return (
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>TokenID</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          {this.renderRows()}
        </tbody>
      </table>
    );
  }
}));


let TokenTableRow = connect((state) => state.tokens)(React.createClass({
  componentWillMount() {
    if (this.tokenData() === undefined) {
      this.props.dispatch(actions.loadTokenData(this.props.tokenId));
    }
  },
  tokenData() {
    return this.props.tokens[this.props.tokenId];
  },
  render() {
    var tokenData = this.tokenData();
    if (tokenData === undefined) {
      return (
        <tr>
          <td>#{this.props.tokenIdx}</td>
          <td colSpan="2">
            Loading token data for <TokenID tokenID={this.props.tokenId} />
          </td>
        </tr>
      )
    } else {
      return (
        <tr>
          <td>#{this.props.tokenIdx}</td>
          <td>
            <Link to={`/tokens/${this.props.tokenId}`}>
              <TokenID tokenId={this.props.tokenId} />
            </Link>
          </td>
          <td>
            <Link to={`/tokens/${this.props.tokenId}`}>
              <EthereumAddress address={tokenData.owner} imageSize={24} />
            </Link>
          </td>
        </tr>
      );
    }
  }
}));
