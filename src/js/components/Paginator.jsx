import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import actions from '../actions'

function mapStateToProps(state) {
  return {
    paginators: state.pagination.paginators,
  }
}

export default function PaginatedComponent(WrappedComponent) {
  return connect(mapStateToProps)(React.createClass({
    componentWillMount() {
      if (_.isEmpty(this.paginator())) {
        this.props.dispatch(actions.initializePaginator(this.props.paginatorKey, this.props.items));
      }
    },
    paginator() {
      return this.props.paginators[this.props.paginatorKey]
    },
    pageNumber() {
      return this.paginator().pageNumber
    },
    pageSize() {
      return this.paginator().pageSize
    },
    pageItemsWithIndices() {
      return this.paginator().pageItemsWithIndices()
    },
    numPages() {
      return this.paginator().numPages()
    },
    nextPage() {
      this.setPageNumber(this.pageNumber() + 1)
    },
    previousPage() {
      this.setPageNumber(this.pageNumber() - 1)
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
            <a className='page-link' onClick={() => this.setPageNumber(pageNumber)} key={pageNumber}>{pageNumber}</a>
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
      if (this.paginator() === undefined) {
        return null
      }
      return (
        <div>
          <WrappedComponent items={this.pageItemsWithIndices()} {..._.omit(this.props, ['items', 'pagination', 'paginatorKey'])} />
          <nav aria-label='Page navigation'>
            <ul className='pagination'>
              {this.renderPrevious()}
              {this.renderNumbers()}
              {this.renderNext()}
            </ul>
          </nav>
        </div>
      );
    }
  }))
}
