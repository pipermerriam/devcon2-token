import * as TokenActions from './tokens'
import * as PaginationActions from './pagination'
import * as Web3Actions from './web3'
import * as AddressActions from './addresses'
import * as ChainActions from './chain'
import * as ConfigActions from './config'
import * as TransactionActions from './transactions'

export default {
  ...TokenActions,
  ...PaginationActions,
  ...Web3Actions,
  ...AddressActions,
  ...ChainActions,
  ...ConfigActions,
  ...TransactionActions,
}
