import React from 'react'
import { connect } from 'react-redux';
import actions from '../actions';


export default connect(state => state.tokens)(React.createClass({
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
          <TokenTableRow />
        </tbody>
      </table>
    );
  }
}));


let TokenTableRow = React.createClass({
  render() {
    return (
      <tr>
        <td>
          Some ID
        </td>
        <td>
          Piper
        </td>
      </tr>
    );
  }
});
