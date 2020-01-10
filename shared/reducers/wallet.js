import { handleActions } from 'redux-helper'
import * as actions from 'actions/wallet'

export const initialState = {
  byId: {},
  allIds: [],
  activeWalletId: null
}

export default handleActions({
  [actions.setActiveWallet] (state, action) {
    state.activeWalletId = action.payload
  },
  [actions.addWallet] (state, action) {
    const wallet = action.payload
    state.byId[wallet.id] = wallet
    state.allIds.push(wallet.id)
  },
  [actions.addWallets] (state, action) {
    action.payload.forEach((wallet) => {
      state.byId[wallet.id] = wallet
      state.allIds.push(wallet.id)
    })
  },
  [actions.mergeWallets] (state, action) {
    action.payload.forEach((wallet) => {
      state.byId[wallet.id] = wallet

      const index = state.allIds.findIndex(v => v === wallet.id)

      if (index === -1) {
        state.allIds.push(wallet.id)
      }
    })
  },
  [actions.removeWallet] (state, action) {
    const id = action.payload
    state.allIds.splice(state.allIds.findIndex(v => v === id), 1)
    delete state.byId[id]
  },
  [actions.updateWalletName] (state, action) {
    const id = action.payload.id
    const name = action.payload.name

    if (state.byId[id]) {
      state.byId[id].name = name
    }
  },
  [actions.updateBitcoinDepositAddress] (state, action) {
    const id = action.payload.id
    const address = action.payload.address

    if (state.byId[id]) {
      state.byId[id].btcDepositAddress = address
    }
  },
  [actions.resetWallet] () {
    return initialState
  }
}, initialState)
