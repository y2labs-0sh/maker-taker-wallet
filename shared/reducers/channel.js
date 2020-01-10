import { handleActions } from 'redux-helper'
import * as actions from 'actions/channel'

export const initialState = {}

export default handleActions({
  [actions.create] (state, action) {
    const { channelId, params } = action.payload
    if (channelId) state[channelId] = params || true
  },
  [actions.close] (state, action) {
    const id = action.payload
    delete state[id]
  },
  [actions.removeWalletChannel] (state, action) {
    const address = action.payload
    const allChannelIds = Object.keys(state)

    allChannelIds.forEach((channelId) => {
      if (channelId.indexOf(address) !== -1) {
        delete state[channelId]
      }
    })
  }
}, initialState)
