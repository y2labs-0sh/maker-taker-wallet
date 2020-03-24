import { createAsyncAction } from 'redux-helper'
// import { createAction } from 'redux-actions'

export const addBorrow = createAsyncAction('market/ADD_BORROW')
export const lendBorrow = createAsyncAction('market/LEND_BORROW')
export const repayBorrow = createAsyncAction('market/REPAY_BORROW')
export const makeBorrow = createAsyncAction('market/MAKE_BORROW')
export const cancelBorrow = createAsyncAction('market/CANCEL_BORROW')
