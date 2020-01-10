import { handleActions } from 'redux-helper'
import * as actions from 'actions/asset'

export const initialState = {
  byId: {},
  allIds: [],
  activeId: null
}

export default handleActions({
  [actions.setActiveAsset] (state, action) {
    state.activeId = action.payload
  }
}, initialState)
