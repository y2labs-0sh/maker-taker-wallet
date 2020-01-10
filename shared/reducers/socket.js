import { handleActions } from 'redux-helper'
import * as actions from 'actions/socket'

export const initialState = {}

export default handleActions({
  [actions.connectSucceeded] (state, action) {
    const id = action.payload

    state[id] = {
      isConnecting: true
    }
  },
  [actions.connectFailed] (state, action) {
    const id = action.payload

    state[id] = {
      isConnecting: false
    }
  },
  [actions.disconnect] (state, action) {
    const id = action.payload
    delete state[id]
  }
}, initialState)
