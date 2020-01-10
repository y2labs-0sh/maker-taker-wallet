import { createAsyncAction } from 'redux-helper'
import { createAction } from 'redux-actions'

export const updateWalletDepositWithdrawHistory = createAction('transaction/UPDATE_WALLET_DEPOSIT_WITHDRAW_HISTORY')
export const updateTransactionHistory = createAction('transaction/UPDATE_TRANSACTION_HISTORY')

export const updateTransferTransactionHistory = createAction('transaction/UPDATE_TRANSFER_TRANSACTION_HISTORY')
export const updateLoanTransactionHistory = createAction('transaction/UPDATE_LOAN_TRANSACTION_HISTORY')
export const updateSavingTransactionHistory = createAction('transaction/UPDATE_SAVING_TRANSACTION_HISTORY')

export const getWalletDepositHistory = createAsyncAction('transaction/GET_WALLET_DEPOSIT_HISTORY')
export const getWalletWithdrawHistory = createAsyncAction('transaction/GET_WALLET_WITHDRAW_HISTORY')
export const getTransactionHistory = createAsyncAction('transaction/GET_TRANSACTION_HISTORY')
export const transferAsset = createAsyncAction('transaction/TRANSFER_ASSET')

export const getTransferTransactionHistory = createAsyncAction('transaction/GET_TRANSFER_TRANSACTION_HISTORY')
export const getLoanTransactionHistory = createAsyncAction('transaction/GET_LOAN_TRANSACTION_HISTORY')
export const getSavingTransactionHistory = createAsyncAction('transaction/GET_SAVING_TRANSACTION_HISTORY')
