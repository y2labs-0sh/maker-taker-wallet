import { createSelector } from 'reselect'
import { sbtcBalanceSelector } from 'selectors/balance'
import { ltvLimitSelector, btcPriceSelector } from 'selectors/loan'

export const totalCreditLineSelector = createSelector(
  sbtcBalanceSelector,
  ltvLimitSelector,
  btcPriceSelector,
  (balance, ltv, price) => {
    if (!balance || !ltv || !price) return null

    let totalBalance = 0
    if (balance.freeBalance) totalBalance += balance.freeBalance

    return totalBalance * ltv * price
  }
)

export const availableCreditLineSelector = createSelector(
  sbtcBalanceSelector,
  ltvLimitSelector,
  btcPriceSelector,
  (balance, ltv, price) => {
    if (!balance || !ltv || !price) return null

    let freeBalance = 0
    freeBalance = balance.freeBalance || freeBalance
    return freeBalance * ltv * price
  }
)
