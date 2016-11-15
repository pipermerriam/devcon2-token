import React from 'react'
import { connect } from 'react-redux'
import actions from '../actions'
import BSBreadcrumb from './BSBreadcrumb'
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
        <div className="row">
          <div className="col-sm-12">
            <BSBreadcrumb>
              <BSBreadcrumb.Crumb linkTo="/" crumbText="Home" />
              <BSBreadcrumb.Crumb crumbText="Token List" />
            </BSBreadcrumb>
          </div>
        </div>
        <Devcon2TokenTable paginatorKey={this.tokenContractAddress}
                           items={this.props.tokenIds} />
      </div>
    )
  },
})))
