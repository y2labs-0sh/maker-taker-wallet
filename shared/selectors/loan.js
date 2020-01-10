import { createSelector } from 'reselect'
import { activeWalletSelector } from 'selectors/wallet'
import { initialState } from 'reducers/loan'

export const loanPackagesSelector = state => state.loan.activeLoanPackage || []
export const btcPriceSelector = state => state.loan.currentBTCPrice || initialState.currentBTCPrice
export const ltvLimitSelector = state => state.loan.liquidationThresholdLimit || initialState.liquidationThresholdLimit
export const activeLoanPackageIdSelector = state => state.loan.activeLoanPackageId || initialState.activeLoanPackageId
export const globalWarningThresholdSelector = state => state.loan.globalWarningThreshold || initialState.globalWarningThreshold
export const globalLiquidationThresholdSelector = state => state.loan.globalLiquidationThreshold || initialState.globalLiquidationThreshold
export const loanAllIdsSelector = state => state.loan.loans.allIds || initialState.loans.allIds
export const loanByIdSelector = state => state.loan.loans.byId || initialState.loans.allIds

export const activePackageSelector = createSelector(
  activeLoanPackageIdSelector,
  loanPackagesSelector,
  (id, packages) => {
    if (!id || !packages) return null
    const activePackage = packages.find(item => item.id === id)
    return activePackage
  }
)

export const accountLoansSelector = createSelector(
  activeWalletSelector,
  loanAllIdsSelector,
  loanByIdSelector,
  btcPriceSelector,
  loanPackagesSelector,
  ltvLimitSelector,
  globalLiquidationThresholdSelector,
  (activeWallet, loanAllIds, loanById, price, loanPackages, ltvLimit, globalLiquidationThreshold) => {
    if (!activeWallet) return []

    const chain = activeWallet.chain
    const address = activeWallet.address
    const id = loanAllIds.find(id => id.indexOf(`${chain}/${address}`) !== -1)

    if (!loanById[id] || !loanById[id].items) return []

    return loanById[id].items.map((item) => {
      const currentLTV = (price && item.collateral_balance_available && item.loan_balance_total) && (item.loan_balance_total / (price * item.collateral_balance_available))
      const availableCreditLine = (ltvLimit && price && item.collateral_balance_available && item.loan_balance_total) && ((ltvLimit * price * item.collateral_balance_available) - +item.loan_balance_total)
      const liquidationTHO = (globalLiquidationThreshold && item.collateral_balance_available && item.loan_balance_total) && (item.loan_balance_total / (item.collateral_balance_available * globalLiquidationThreshold))
      const packageInfo = loanPackages && loanPackages.find(pkg => pkg.id === item.package_id)
      const terms = packageInfo && packageInfo.terms

      return { ...item, currentLTV, terms, availableCreditLine: availableCreditLine > 0 ? availableCreditLine : 0, liquidationTHO }
    })
  }
)

export const collateralBTCAmountSelector = createSelector(
  accountLoansSelector,
  (loans) => {
    if (!loans) return null

    return loans.reduce((balance, item) => {
      return balance + item.collateral_balance
    }, 0)
  }
)

export const activeLoanPackageSelector = createSelector(
  accountLoansSelector,
  activeLoanPackageIdSelector,
  (accountLoans, id) => {
    if (!accountLoans || !accountLoans.length || !id) return null

    const loanPackage = accountLoans.find(item => item.id === id)
    return loanPackage
  }
)
