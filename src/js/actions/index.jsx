import * as TokenActions from './tokens'
import * as PaginationActions from './pagination'
import * as Web3Actions from './web3'
import * as AddressActions from './addresses'


export default {
  ...TokenActions,
  ...PaginationActions,
  ...Web3Actions,
  ...AddressActions,
}
