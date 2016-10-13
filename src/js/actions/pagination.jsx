import TYPES from './types'


export function setPageNumber(paginatorKey, pageNumber) {
  return {
    type: TYPES.PAGINATION_SET_PAGE_NUMBER,
    paginatorKey: paginatorKey,
    pageNumber: pageNumber,
  };
}

export function increasePageNumber(paginatorKey) {
  return {
    type: TYPES.PAGINATION_INCREASE_PAGE_NUMBER,
    paginatorKey: paginatorKey,
  };
}

export function decreasePageNumber(paginatorKey) {
  return {
    type: TYPES.PAGINATION_DECREASE_PAGE_NUMBER,
    paginatorKey: paginatorKey,
  };
}

export function setItemCount(paginatorKey, itemCount) {
  return {
    type: TYPES.PAGINATION_SET_ITEM_COUNT,
    paginatorKey: paginatorKey,
    itemCount: itemCount,
  };
}
