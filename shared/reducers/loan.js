import { handleActions } from 'redux-helper'
import * as actions from 'actions/loan'

export const initialState = {
  loanAccountId: null,
  collateralAssetId: null,
  loanAssetId: null,
  liquidationThresholdLimit: null,
  globalLiquidationThreshold: null,
  nextLoanPackageId: null,
  activeLoanPackage: null,
  loanPackageInfo: null,
  nextLoanId: null,
  currentBTCPrice: null,
  isBTCPriceLocked: false,
  totalLoan: null,
  globalWarningThreshold: null,
  activeLoanPackageId: null,
  liquidationLoans: null,
  loans: {
    allIds: [],
    byId: {}
  }
}

export default handleActions({
  [actions.updateLoanAccountId] (state, action) {
    state.loanAccountId = action.payload
  },
  [actions.updateCollateralAssetId] (state, action) {
    state.collateralAssetId = action.payload
  },
  [actions.updateLoanAssetId] (state, action) {
    state.loanAssetId = action.payload
  },
  [actions.updateLiquidationThresholdLimit] (state, action) {
    state.liquidationThresholdLimit = action.payload
  },
  [actions.updateGlobalLiquidationThreshold] (state, action) {
    state.globalLiquidationThreshold = action.payload
  },
  [actions.updateNextLoanPackageId] (state, action) {
    state.nextLoanPackageId = action.payload
  },
  [actions.updateActiveLoanPackage] (state, action) {
    state.activeLoanPackage = action.payload
  },
  [actions.updateLoanPackageInfo] (state, action) {
    state.loanPackageInfo = action.payload
  },
  [actions.updateNextLoanId] (state, action) {
    state.nextLoanId = action.payload
  },
  [actions.updateCurrentBTCPrice] (state, action) {
    if (!state.isBTCPriceLocked) state.currentBTCPrice = action.payload
  },
  [actions.updateTotalLoan] (state, action) {
    state.totalLoan = action.payload
  },
  [actions.updateGlobalWarningThreshold] (state, action) {
    state.globalWarningThreshold = action.payload
  },
  [actions.setActiveLoanPackage] (state, action) {
    state.activeLoanPackageId = action.payload
  },
  [actions.updateLiquidationLoans] (state, action) {
    state.liquidationLoans = action.payload
  },
  [actions.updateLoans] (state, action) {
    const id = action.payload.id

    if (!state.loans.byId[id]) {
      state.loans.allIds.push(id)
    }

    state.loans.byId[id] = action.payload
  }
}, initialState)
