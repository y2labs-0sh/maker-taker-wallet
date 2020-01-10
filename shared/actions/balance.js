import { createAsyncAction } from 'redux-helper'
import { createAction } from 'redux-actions'

export const subscribeBalance = createAction('balance/SUBSCRIBE')
export const unsubscribeBalance = createAction('balance/UNSUBSCRIBE')
export const updateBalance = createAction('balance/UPDATE')
export const resetBalance = createAction('balance/RESET')
export const removeWalletBalance = createAction('balance/REMOVE_WALLET')
export const getRBTCLockBalance = createAsyncAction('balance/GET_RBTC_LOCK')
