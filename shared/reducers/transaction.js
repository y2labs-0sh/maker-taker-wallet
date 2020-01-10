import { handleActions } from 'redux-helper'
import * as actions from 'actions/transaction'

export const initialState = {
  byId: {},
  allIds: [],
  scan: {
    byId: {},
    allIds: [],
  },
  loan: {
    byId: {},
    allIds: [],
  },
  saving: {
    byId: {},
    allIds: [],
  },
  transfer: {
    byId: {},
    allIds: [],
  }
}

export default handleActions({
  [actions.updateWalletDepositWithdrawHistory] (state, action) {
    const id = action.payload.id
    if (state.allIds.indexOf(id) === -1) state.allIds.push(id)

    state.byId[id] = state.byId[id] || {}
    state.byId[id].byId = state.byId[id].byId || {}
    state.byId[id].allIds = state.byId[id].allIds || []
    const { items, ...info } = action.payload

    items.forEach((item) => {
      const itemId = item.uuid || item.id
      const createdAt = +new Date(item.createdAt)
      state.byId[id].byId[`${itemId}/${createdAt}`] = item
      if (state.byId[id].allIds.indexOf(`${itemId}/${createdAt}`) === -1) {
        state.byId[id].allIds.push(`${itemId}/${createdAt}`)
        state.byId[id].allIds.sort((a, b) => +b.split('/')[1] - +a.split('/')[1])
      }
    })

    state.byId[id] = { ...state.byId[id], ...info }
  },
  [actions.updateTransferTransactionHistory] (state, action) {
    const id = action.payload.id
    if (state.transfer.allIds.indexOf(id) === -1) state.transfer.allIds.push(id)

    state.transfer.byId[id] = state.transfer.byId[id] || {}
    state.transfer.byId[id] = { ...state.transfer.byId[id], ...action.payload }
  },
  [actions.updateLoanTransactionHistory] (state, action) {
    const id = action.payload.id
    if (state.loan.allIds.indexOf(id) === -1) state.loan.allIds.push(id)

    state.loan.byId[id] = state.loan.byId[id] || {}
    state.loan.byId[id] = { ...state.loan.byId[id], ...action.payload }
  },
  [actions.updateSavingTransactionHistory] (state, action) {
    const id = action.payload.id
    if (state.saving.allIds.indexOf(id) === -1) state.saving.allIds.push(id)

    state.saving.byId[id] = state.saving.byId[id] || {}
    state.saving.byId[id] = { ...state.saving.byId[id], ...action.payload }
  },
  [actions.updateTransactionHistory] (state, action) {
    const id = action.payload.id
    if (state.scan.allIds.indexOf(id) === -1) state.scan.allIds.push(id)

    state.scan.byId[id] = state.scan.byId[id] || {}
    state.scan.byId[id] = { ...state.scan.byId[id], ...action.payload }
  }
}, initialState)
