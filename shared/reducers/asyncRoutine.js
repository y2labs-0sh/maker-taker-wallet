import { createAsyncActionsReducers, getAsyncActions } from 'redux-helper'
import * as walletActions from 'actions/wallet'
import * as transactionActions from 'actions/transaction'
import * as stakeActions from 'actions/stake'
import * as loanActions from 'actions/loan'

export default createAsyncActionsReducers(
  getAsyncActions({
    ...walletActions,
    ...transactionActions,
    ...stakeActions,
    ...loanActions
  })
)
