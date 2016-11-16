import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import _ from 'lodash'
import { push } from 'react-router-redux';
import actions from '../actions'
import EthereumAddress from './EthereumAddress'
import BSCard from './BSCard'
import LookupTokenByAddressForm from './LookupTokenByAddressForm'

function mapStateToProps(state) {
  return {
    tokenContractAddress: state.config.INDIVIDUALITY_TOKEN_ROOT_CONTRACT_ADDRESS,
  }
}

export default connect(mapStateToProps)(React.createClass({
  handleLookupByAddressSubmit(formData) {
    this.props.dispatch(push(`addresses/${formData.tokenOwnerAddress}`))
  },
  render() {
    return (
      <div className='row'>
        <div className='col-sm-7'>
          <div className='container'>
            <div className='row'>
              <div className='col-sm-12'>
                <BSCard>
                  <BSCard.Header>
                    Devcon2 Proof of Individuality Token
                  </BSCard.Header>
                  <BSCard.Block>
                    <BSCard.Text><EthereumAddress address={this.props.tokenContractAddress} imageSize={32} /></BSCard.Text>
                    <BSCard.Text>During Devcon2 in 2016 a total of 231 tokens were issued to conference attendees.</BSCard.Text>
                    <Link className='btn btn-primary' to='/tokens'>Explore Tokens</Link>
                  </BSCard.Block>
                </BSCard>
              </div>
              <div className='col-sm-12'>
                <BSCard>
                  <BSCard.Header>
                    Lookup Your Token
                  </BSCard.Header>
                  <BSCard.Block>
                    <LookupTokenByAddressForm onSubmit={this.handleLookupByAddressSubmit} />
                  </BSCard.Block>
                </BSCard>
              </div>
            </div>
          </div>
        </div>
        <div className='col-sm-5'>
          <BSCard>
            <BSCard.Header>What is this good for?</BSCard.Header>
            <BSCard.Block>
              <BSCard.Text>This is first and foremost an experiment.  The idea is to see what can be done with this data set which has the following interesting properties.</BSCard.Text>
              <ol>
                <li>The owners of these tokens are predominantly involved members of the Ethereum ecosystem.</li>
                <li>The set of address that comprises the owners of these tokens is sybil resistant.</li>
              </ol>
              <BSCard.Text>With these two thing in mind, some of the potential use cases for this data set are things like:</BSCard.Text>
              <ul>
                <li>Polling only a subset of the ethereum community on topics such as hard forks</li>
                <li>Restricting access to something like an early alpha release of a platform</li>
                <li>Bootstrapping a web-of-trust</li>
              </ul>
            </BSCard.Block>
          </BSCard>
        </div>
      </div>
    )
  },
}))
