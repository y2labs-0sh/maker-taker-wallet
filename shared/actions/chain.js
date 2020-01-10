import { createAsyncAction } from 'redux-helper'
import { createAction } from 'redux-actions'

export const getWalletTransactionHistory = createAsyncAction('chain/GET_WALLET_TRANSACTION_HISTORY')
export const updateWalletDepositWithdrawHistory = createAction('chain/UPDATE_WALLET_TRANSACTION_HISTORY')
export const subscribeChainState = createAction('chain/SUBSCRIBE_CHAIN_STATE')
export const unsubscribeChainState = createAction('chain/UNSUBSCRIBE_CHAIN_STATE')
export const updateChainState = createAction('chain/UPDATE_CHAIN_STATE')
