import _ from 'lodash'
import TYPES from '../actions/types'

var initialState = {
  paginators: {},
};


const PAGINATOR_DEFAULTS = {
  pageNumber: 1,
  pageSize: 10,
  itemCount: undefined,
}


function computeNumPages(itemCount, pageSize, defaultNumPages) {
  if (itemCount === undefined) {
    return defaultNumPages;
  }
  return _.ceil(itemCount / pageSize);
}


export default function(state, action) {
  if (state === undefined) {
    return initialState;
  }

  var newState = state;

  switch (action.type) {
    case TYPES.PAGINATION_INCREASE_PAGE_NUMBER:
      console.log('INCREASING PAGE NUMBER');

      var paginator = _.get(
        newState.paginators,
        action.paginatorKey,
        {...PAGINATOR_DEFAULTS},
      )
      var newPageNumber = _.min([
        paginator.pageNumber + 1,
        computeNumPages(
          paginator.itemCount,
          paginator.pageSize,
          paginator.pageNumber + 1,
        ),
      ]);
      console.log(paginator.pageNumber, newPageNumber);

      newState = {
        ...newState,
        paginators: {
          ...newState.paginators,
          [action.paginatorKey]: {...paginator, pageNumber: newPageNumber},
        }
      };
      break;
    case TYPES.PAGINATION_DECREASE_PAGE_NUMBER:
      console.log('DECREASING PAGE NUMBER');

      var paginator = _.get(
        newState.paginators,
        action.paginatorKey,
        {...PAGINATOR_DEFAULTS},
      )
      var newPageNumber = _.max([
        1,
        paginator.pageNumber - 1,
      ]);

      newState = {
        ...newState,
        paginators: {
          ...newState.paginators,
          [action.paginatorKey]: {...paginator, pageNumber: newPageNumber},
        }
      };
      break;
    case TYPES.PAGINATION_SET_PAGE_NUMBER:
      console.log('SET PAGE NUMBER');

      var paginator = _.get(
        newState.paginators,
        action.paginatorKey,
        {...PAGINATOR_DEFAULTS},
      )
      var newPageNumber = _.clamp(
        action.pageNumber,
        1,
        computeNumPages(
          paginator.itemCount,
          paginator.pageSize,
          action.pageNumber,
        ),
      );

      newState = {
        ...newState,
        paginators: {
          ...newState.paginators,
          [action.paginatorKey]: {...paginator, pageNumber: newPageNumber},
        }
      };
      break;
    case TYPES.PAGINATION_SET_ITEM_COUNT:
      console.log('SET ITEM COUNT');

      var paginator = _.get(
        newState.paginators,
        action.paginatorKey,
        {...PAGINATOR_DEFAULTS},
      )

      newState = {
        ...newState,
        paginators: {
          ...newState.paginators,
          [action.paginatorKey]: {
            ...paginator,
            itemCount: action.itemCount,
            pageNumber: _.min([
              computeNumPages(action.itemCount, paginator.pageSize),
              paginator.pageNumber,
            ]),
          },
        }
      };
      break;
  }

  return newState;
}
