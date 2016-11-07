import React from 'react'


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
    return <i className="fa fa-times"></i>
  }
});

let YesWithIcon = React.createClass({
  render() {
    return <i className="fa fa-check"></i>
  }
});
