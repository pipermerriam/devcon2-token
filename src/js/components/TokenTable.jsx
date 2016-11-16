import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import actions from '../actions'
import PaginatedComponent from './Paginator'
import TokenID from './TokenID'
import EthereumAddress from './EthereumAddress'
import YesNoWithIcon from './YesNoWithIcon'

function mapStateToTokenTableProps(state) {
  return {}
}

export default PaginatedComponent(connect(mapStateToTokenTableProps)(React.createClass({
  renderRows() {
    return _.map(this.props.items, _.spread(function(idx, tokenId) {
      return (
        <TokenTableRow tokenIdx={idx + 1}
                       tokenId={tokenId}
                       key={tokenId} />
      );
    }));
  },
  render() {
    return (
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>TokenID</th>
            <th>Owner</th>
            <th>Upgraded</th>
          </tr>
        </thead>
        <tbody>
          {this.renderRows()}
        </tbody>
      </table>
    );
  }
})));

function mapStateToTokenRowProps(state) {
  return {
    tokenDetails: state.tokens.tokenDetails,
  }
}

let TokenTableRow = connect(mapStateToTokenRowProps)(React.createClass({
  componentWillMount() {
    if (_.isEmpty(this.props.tokenDetails[this.props.tokenId]) ) {
      this.props.dispatch(actions.loadTokenData(this.props.tokenId));
    }
  },
  tokenData() {
    return this.props.tokenDetails[this.props.tokenId];
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
            <Link to={`/addresses/${tokenData.owner}`}>
              <EthereumAddress address={tokenData.owner} imageSize={24} />
            </Link>
          </td>
          <td>
            <YesNoWithIcon yesOrNo={tokenData.isTokenUpgraded} />
          </td>
        </tr>
      );
    }
  }
}));
