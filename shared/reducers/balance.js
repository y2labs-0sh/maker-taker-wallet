import { handleActions } from 'redux-helper'
import * as actions from 'actions/balance'

export const initialState = {
  byId: {},
  allIds: []
}

export default handleActions({
  [actions.updateBalance] (state, action) {
    const id = action.payload.id

    if (!state.byId[id]) {
      state.allIds.push(id)
    }

    state.byId[id] = state.byId[id] || {}
    state.byId[id] = { ...state.byId[id], ...action.payload }
  },
  [actions.removeWalletBalance] (state, action) {
    const address = action.payload
    const walletAssetIds = state.allIds.filter(id => id.indexOf(address) !== -1)
    walletAssetIds.forEach((id) => {
      delete state.byId[id]
    })
    state.allIds = state.allIds.filter(id => id.indexOf(address) === -1)
  },
  [actions.resetBalance] () {
    return initialState
  }
}, initialState)
