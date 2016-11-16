import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import actions from '../actions'
import LoadingSpinner from './LoadingSpinner'
import HideUntilChainLoaded from './HideUntilChainLoaded'
import EthereumAddress from './EthereumAddress'
import BSAlert from './BSAlert'

function mapStateToProps(state) {
  return {
    '_tokenContractAddress': state.config.INDIVIDUALITY_TOKEN_ROOT_CONTRACT_ADDRESS,
    '_tokenContractCode': state.tokens.contractCode,
  }
}

export default function HideIfNoTokenContract(WrappedComponent) {
  return HideUntilChainLoaded(connect(mapStateToProps)(React.createClass({
    componentWillMount() {
      if (this.props._tokenContractCode === null) {
        this.props.dispatch(actions.checkContractCode())
      }
    },
    render() {
      if (this.props._tokenContractCode === null) {
        return <span><LoadingSpinner /> Checking token contract is present on chain</span>
      } else if (this.props._tokenContractCode === '0x') {
        return (
          <div className="row">
            <div className="col-sm-12">
              <BSAlert type="warning">
                <BSAlert.Heading>Contract Not Found</BSAlert.Heading>
                <p>It looks like the chain that web3 is connected to does not contain the token contract.  The code found at contract address <EthereumAddress address={this.props._tokenContractAddress} imageSize={12} /> was <code>0x</code>.  Check your web3 is connected to the appropriate chain.</p>
              </BSAlert>
            </div>
          </div>
        )
      } else {
        return (
          <WrappedComponent {..._.omit(this.props, ['_tokenContractCode', '_tokenContractAddress'])} />
        )
      }
    }
  })))
}
