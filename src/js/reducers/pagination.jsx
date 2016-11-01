import _ from 'lodash'
import TYPES from '../actions/types'

var initialState = {
  paginators: {},
}


export const PAGINATOR_DEFAULTS = {
  pageNumber: 1,
  pageSize: 10,
}

export function Paginator(options) {
  Object.assign(this, PAGINATOR_DEFAULTS, options || {})
  Object.assign(this, {
    leftBound() {
      return (this.pageNumber - 1) * this.pageSize
    },
    rightBound() {
      return this.leftBound() + this.pageSize
    },
    idxOffset() {
      return this.leftBound()
    },
    itemCount() {
      return this.items.length
    },
    numPages() {
      return _.ceil(this.itemCount() / this.pageSize)
    },
    pageItems() {
      return _.slice(this.items, this.leftBound(), this.rightBound())
    },
    pageItemsWithIndices() {
      return _.map(this.pageItems(), function(item, idx) {
        return [idx, item]
      })
    },
    setPageNumber(pageNumber) {
      var newPageNumber = _.clamp(
        pageNumber,
        1,
        this.numPages(),
      )
      return this.clone({pageNumber: newPageNumber})
    },
    clone(overrides) {
      return new Paginator(Object.assign({}, {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        items: this.items,
      }, overrides))
    },
  })
  return this
}

export default function(state, action) {
  if (state === undefined) {
    return initialState
  }

  var newState = state

  switch (action.type) {
    case TYPES.PAGINATION_SET_PAGE_NUMBER:
      console.log('SET PAGE NUMBER')

      var paginator = _.get(
        newState.paginators,
        action.paginatorKey,
        new Paginator(),
      ).setPageNumber(action.pageNumber)

      newState = {
        ...newState,
        paginators: {
          ...newState.paginators,
          [action.paginatorKey]: paginator,
        }
      }
      break
    case TYPES.PAGINATION_INITIALIZE_PAGINATOR:
      console.log('INITIALIZING PAGINATOR')

      var paginator = new Paginator({
        items: action.items,
      })

      newState = {
        ...newState,
        paginators: {
          ...newState.paginators,
          [action.paginatorKey]: paginator.clone({
            pageNumber: _.min([
              paginator.numPages(),
              paginator.pageNumber,
            ]),
          }),
        }
      }
      break
  }

  return newState
}
