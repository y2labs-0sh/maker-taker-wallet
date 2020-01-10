import { handleActions } from 'redux-helper'
import * as actions from 'actions/queue'

export const initialState = []

export default handleActions({
  [actions.pend] (state, action) {
    return [action.payload, ...state]
  },
  [actions.empty] () {
    return []
  }
}, initialState)
