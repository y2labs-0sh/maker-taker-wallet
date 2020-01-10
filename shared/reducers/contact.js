import { handleActions } from 'redux-helper'
import * as actions from 'actions/contact'

export const initialState = {
  allIds: [],
  byId: {},
  activeId: null
}

export default handleActions({
  [actions.addContact] (state, action) {
    const { id } = action.payload
    const index = state.allIds.findIndex(item => item === id)
    if (index === -1) {
      state.allIds = [id, ...state.allIds]
      state.byId[id] = action.payload
    } else {
      state.byId[id] = state.byId[id] || {}
      state.byId[id] = { ...state.byId[id], ...action.payload }
    }
  },
  [actions.setActiveContact] (state, action) {
    state.activeId = action.payload
  },
  [actions.updateContact] (state, action) {
    const { id } = action.payload
    const index = state.allIds.findIndex(item => item === id)
    if (index !== -1) {
      state.byId[id] = action.payload
    }
  },
  [actions.deleteContact] (state, action) {
    const id = action.payload
    const index = state.allIds.findIndex(item => item === id)
    if (index !== -1) {
      state.allIds.splice(index, 1)
    }
    delete state.byId[id]
  }
}, initialState)
