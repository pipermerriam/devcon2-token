import React from 'react'

let Card = React.createClass({
  render() {
    return (
      <div className="card">
        {this.props.children}
      </div>
    )
  }
})

let CardHeader = React.createClass({
  render() {
    return (
      <div className="card-header">
        {this.props.children}
      </div>
    )
  }
})

Card.Header = CardHeader

let CardBlock = React.createClass({
  render() {
    return (
      <div className="card-block">
        {this.props.children}
      </div>
    )
  }
})

Card.Block = CardBlock

let CardBlockQuote = React.createClass({
  render() {
    return (
      <blockquote className="card-blockquote">
        {this.props.children}
      </blockquote>
    )
  }
})

Card.BlockQuote = CardBlockQuote

let CardFooter = React.createClass({
  render() {
    return (
      <div className="card-footer">
        {this.props.children}
      </div>
    )
  }
})

Card.Footer = CardFooter

export default Card
