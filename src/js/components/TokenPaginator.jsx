import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import actions from '../actions'

export default connect((state) => state.pagination)(React.createClass({
  componentWillMount() {
    this.props.dispatch(actions.setItemCount(this.props.itemCount));
  },
  pageNumber() {
    return _.get(this.props.paginators, this.props.paginatorKey + '.pageNumber', 1);
  },
  pageSize() {
    return _.get(this.props.paginators, this.props.paginatorKey + '.pageSize', 10);
  },
  numPages() {
    return _.ceil(this.props.itemCount / this.pageSize());
  },
  nextPage() {
    this.props.dispatch(actions.increasePageNumber(this.props.paginatorKey));
  },
  previousPage() {
    this.props.dispatch(actions.decreasePageNumber(this.props.paginatorKey));
  },
  setPageNumber(pageNumber) {
    this.props.dispatch(actions.setPageNumber(this.props.paginatorKey, pageNumber));
  },
  hasPreviousPage() {
    return (this.pageNumber() > 1);
  },
  hasNextPage() {
    return (this.pageNumber() < this.numPages());
  },
  allPageNumbers() {
    return _.range(1, this.numPages() + 2);
  },
  pageNumberWindow() {
    return _.range(
      _.max([1, this.pageNumber() - 4]),
      _.min([this.numPages() + 1, this.pageNumber() + 4]),
    )
  },
  renderNumbers() {
    return _.map(this.pageNumberWindow(), function(pageNumber) {
      var classNames = ['page-item'];
      if (pageNumber === this.pageNumber()) {
        classNames = [...classNames, 'active'];
      }
      return (
        <li className={_.join(classNames, ' ')} key={pageNumber}>
          <a className='page-link' onClick={() => this.setPageNumber(pageNumber)}>{pageNumber}</a>
        </li>
      );
    }.bind(this));
  },
  renderPrevious() {
    var classNames = ['page-item'];
    if (!this.hasPreviousPage()) {
      classNames = [...classNames, 'disabled'];
    }
    return (
      <li className={_.join(classNames, ' ')}>
        <a className='page-link'
           href='#'
           aria-label='Previous' 
           onClick={this.previousPage}>
          <span aria-hidden='true'>&laquo;</span>
          <span className='sr-only'>Previous</span>
        </a>
      </li>
    );
  },
  renderNext() {
    var classNames = ['page-item'];
    if (!this.hasNextPage()) {
      classNames = [...classNames, 'disabled'];
    }
    return (
      <li className={_.join(classNames, ' ')}>
        <a className='page-link'
           href='#' 
           aria-label='Next' 
           onClick={this.nextPage}>
          <span aria-hidden='true'>&raquo;</span>
          <span className='sr-only'>Next</span>
        </a>
      </li>
    );
  },
  render() {
    return (
      <nav aria-label='Page navigation'>
        <ul className='pagination'>
          {this.renderPrevious()}
          {this.renderNumbers()}
          {this.renderNext()}
        </ul>
      </nav>
    );
  }
}));

