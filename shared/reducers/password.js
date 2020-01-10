import { handleActions } from 'redux-helper'
import * as actions from 'actions/password'

export const initialState = {
  requesting: false
}

export default handleActions({
  [actions.requestPassword] (state) {
    state.requesting = true
  },
  [actions.submitPassword] (state) {
    state.requesting = false
  },
  [actions.cancelPassword] (state) {
    state.requesting = false
  }
}, initialState)
