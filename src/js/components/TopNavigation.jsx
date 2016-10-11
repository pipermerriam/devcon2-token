import React from 'react'
import { connect } from 'react-redux';
import _ from 'lodash';
import actions from '../actions';


export default connect(state => state.web3)(React.createClass({
  componentWillMount() {
    if (this.props.web3Options === null) {
      this.props.dispatch(actions.initializeWeb3());
    }
  },
  updateWeb3(event) {
    this.props.dispatch(actions.selectWeb3(event.target.value));
  },
  renderWeb3Select() {
    if (this.props.web3Options === null) {
      return null;
    } else {
      return (
        <div className="form-group">
          <label htmlFor="web3-connection">Web3 Connection</label>
          <select className="form-control" id="web3-connection" defaultValue={this.props.selectedWeb3} onChange={this.updateWeb3}>
            {_.map(this.props.web3Options, _.spread(function(display, choice) {
              return (
                <option value={choice} key={choice}>{display}</option>
              );
            }))}
          </select>
        </div>
      );
    }
  },
  render() {
    return (
      <nav className="navbar navbar-dark bg-inverse">
        <a className="navbar-brand" href="#">Devcon2 Tokens</a>
        {this.renderWeb3Select()}
      </nav>
    );
  }
}));
