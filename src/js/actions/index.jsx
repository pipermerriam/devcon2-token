import * as TokenActions from './tokens'
import * as PaginationActions from './pagination'
import * as Web3Actions from './web3'


export default {
  ...TokenActions,
  ...PaginationActions,
  ...Web3Actions,
}
