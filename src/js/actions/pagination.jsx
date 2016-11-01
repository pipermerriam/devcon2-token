import TYPES from './types'
import { Paginator } from '../reducers/pagination'

export function initializePaginator(paginatorKey, items) {
  return {
    type: TYPES.PAGINATION_INITIALIZE_PAGINATOR,
    paginatorKey: paginatorKey,
    items: items,
  }
}

export function setPageNumber(paginatorKey, pageNumber) {
  return {
    type: TYPES.PAGINATION_SET_PAGE_NUMBER,
    paginatorKey: paginatorKey,
    pageNumber: pageNumber,
  }
}
