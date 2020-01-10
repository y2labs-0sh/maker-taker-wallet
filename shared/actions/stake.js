import { createAsyncAction } from 'redux-helper'
import { createAction } from 'redux-actions'

export const stakeBTC = createAsyncAction('stake/STAKE_BTC')
export const unstakeBTC = createAsyncAction('stake/UNSTAKE_BTC')

export const getSBTCAssetId = createAsyncAction('stake/GET_SBTC_ASSET_ID')
export const getSavingAccountId = createAsyncAction('stake/GET_SAVING_ACCOUNT_ID')

export const getRBTCAssetId = createAsyncAction('stake/GET_RBTC_ASSET_ID')

export const getCurrentPhaseId = createAsyncAction('stake/GET_CURRENT_PHASE_ID')
export const getCurrentPhaseInfo = createAsyncAction('stake/GET_CURRENT_PHASE_INFO')

export const getUsedQuota = createAsyncAction('stake/GET_USED_QUOTA')
export const getPhaseList = createAsyncAction('stake/GET_PHASE_LIST')

export const updateSBTCAssetId = createAction('stake/UPDATE_SBTC_ASSET_ID')
export const updateRBTCAssetId = createAction('stake/UPDATE_RBTC_ASSET_ID')
export const updateSavingAccountId = createAction('stake/UPDATE_SAVING_ACCOUNT_ID')
export const updateCurrentPhaseId = createAction('stake/UPDATE_CURRENT_PHASE_ID')
export const updateCurrentPhaseInfo = createAction('stake/UPDATE_CURRENT_PHASE_INFO')
export const updateUsedQuota = createAction('stake/UPDATE_USED_QUOTA')
export const updatePhaseList = createAction('stake/UPDATE_PHASE_LIST')
export const selectPhaseAsset = createAction('stake/SELECT_PHASE_ASSET')
