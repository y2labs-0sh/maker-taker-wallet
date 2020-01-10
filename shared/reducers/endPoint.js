import { handleActions } from 'redux-helper'
import * as actions from 'actions/endPoint'
import { RIO_CHAIN_API } from 'constants/env'

export const initialState = {
  allIds: [RIO_CHAIN_API],
  byId: {
    RIO_CHAIN_API: {
      name: 'Definex',
      url: RIO_CHAIN_API
    }
  },
  active: RIO_CHAIN_API
}

export default handleActions({
  [actions.addEndPoint] (state, action) {
    const { url } = action.payload
    const index = state.allIds.findIndex(item => item === url)
    if (index === -1) {
      state.allIds.push(url)
      state.byId[url] = action.payload
    }
  },
  [actions.deleteEndPoint] (state, action) {
    const url = action.payload
    const index = state.allIds.findIndex(item => item === url)
    if (index !== -1) {
      state.allIds.splice(index, 1)
    }
    delete state.byId[url]
  },
  [actions.setActiveEndPoint] (state, action) {
    state.active = action.payload
  },
  [actions.updateEndPointStatus] (state, action) {
    action.payload.forEach((node) => {
      const { url } = node
      if (state.allIds.indexOf(url) === -1) state.allIds.push(url)
      state.byId[url] = state.byId[url] || {}
      state.byId[url] = { ...state.byId[url], ...node }
    })
  }
}, initialState)
