import { handleActions } from 'redux-helper'
import * as actions from 'actions/chain'

export const initialState = {
  chainState: {}
}

export default handleActions({
  [actions.updateWalletDepositWithdrawHistory] (state, action) {
    const id = action.payload.id

    if (!state.byId[id]) {
      state.allIds.push(id)
    }

    state.byId[id] = action.payload
  },
  [actions.updateChainState] (state, action) {
    state.chainState = { ...state.chainState, ...action.payload }
  }
}, initialState)
