import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import _ from 'lodash'
import actions from '../actions'
import HideIfNoTokenContract from './HideIfNoTokenContract'
import EthereumAddress from './EthereumAddress'

function mapStateToExplorerProps(state) {
  return {
    devcon2TokenAddress: state.config.DEVCON2_TOKEN_CONTRACT_ADDRESS,
    ...state.tokens,
    ...state.web3,
  }
}

export default HideIfNoTokenContract(connect(mapStateToExplorerProps)(React.createClass({
  componentWillMount() {
    if (_.isEmpty(this.props.tokenMeta)) {
      this.props.dispatch(actions.loadTokenMeta());
    }
  },
  render() {
    return (
      <div className='row'>
        <div className='col-sm-7'>
          <div className='card'>
            <div className='card-block'>
              <h5 className='card-title'>
                <p>Devcon2 Proof of Individuality Token</p>
                <EthereumAddress address={this.devcon2TokenAddress}
                                 imageSize={32} />
              </h5>
              <p className='card-text'>During Devcon2 in 2016 a total of 231 tokens were issued to conference attendees.</p>
              <Link className='btn btn-primary' to='/tokens'>Explore Tokens</Link>
            </div>
          </div>
        </div>
        <div className='col-sm-5'>
          <div className='card'>
            <div className='card-block'>
              <h4 className='card-title'>What is this good for?</h4>
              <p>This is first and foremost an experiment.  The idea is to see what can be done with this data set which has the following interesting properties.</p>
              <ol>
                <li>The owners of these tokens are predominantly involved members of the Ethereum ecosystem.</li>
                <li>The set of address that comprises the owners of these tokens is sybil resistant.</li>
              </ol>
              <p>With these two thing in mind, some of the potential use cases for this data set are things like:</p>
              <ul>
                <li>Polling only a subset of the ethereum community on topics such as hard forks</li>
                <li>Restricting access to something like an early alpha release of a platform</li>
                <li>Bootstrapping a web-of-trust</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  },
})))

