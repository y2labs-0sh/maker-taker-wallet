// import { createSelector } from 'reselect'

export const sbtcAssetIdSelector = state => state.stake.sbtc_asset_id
export const rbtcAssetIdSelector = state => state.stake.rbtc_asset_id
export const savingAccountIdSelector = state => state.stake.saving_account_id
export const phaseListSelector = state => state.stake.phase_list
export const currentPhaseAssetIdSelector = state => state.stake.current_phase_info && state.stake.current_phase_info.iou_asset_id
export const rscAssetIdSelector = state => state.stake.current_phase_info && state.stake.current_phase_info.iou_asset_id
export const selectedPhaseAssetIdSelector = state => state.stake.selectedPhaseAssetId
