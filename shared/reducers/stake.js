import { handleActions } from 'redux-helper'
import * as actions from 'actions/stake'

export const initialState = {
  sbtc_asset_id: null,
  rbtc_asset_id: null,
  saving_account_id: null,
  current_phase_id: null,
  current_phase_info: null,
  used_quota: null,
  phase_list: null,
  selectedPhaseAssetId: null
}

export default handleActions({
  [actions.updateSBTCAssetId] (state, action) {
    state.sbtc_asset_id = action.payload
  },
  [actions.updateRBTCAssetId] (state, action) {
    state.rbtc_asset_id = action.payload
  },
  [actions.updateSavingAccountId] (state, action) {
    state.saving_account_id = action.payload
  },
  [actions.updateCurrentPhaseId] (state, action) {
    state.current_phase_id = action.payload
  },
  [actions.updateUsedQuota] (state, action) {
    state.used_quota = action.payload
  },
  [actions.updateCurrentPhaseInfo] (state, action) {
    state.current_phase_info = action.payload
  },
  [actions.updatePhaseList] (state, action) {
    state.phase_list = action.payload
  },
  [actions.selectPhaseAsset] (state, action) {
    state.selectedPhaseAssetId = action.payload
  }
}, initialState)
