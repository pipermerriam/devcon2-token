import React from 'react'
import Icon from './FAIcon'


export default React.createClass({
  render() {
    if (this.props.yesOrNo) {
      return <YesWithIcon />
    } else {
      return <NoWithIcon />
    }
  }
});

let NoWithIcon = React.createClass({
  render() {
    return <span>No <Icon icon="times" /></span>
  }
});

let YesWithIcon = React.createClass({
  render() {
    return <span>Yes <Icon icon="check" /></span>
  }
});
