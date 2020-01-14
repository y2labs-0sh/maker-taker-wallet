import { createSelector } from 'reselect'
import { initialState } from 'reducers/balance'
import { activeWalletSelector } from 'selectors/wallet'
import { activeAssetIdSelector } from 'selectors/asset'
import { phaseListSelector, selectedPhaseAssetIdSelector } from 'selectors/stake'
import { accountLoansSelector } from 'selectors/loan'

const balanceAllIdsSelector = state => state.balance.allIds || initialState.allIds
const balanceByIdSelector = state => state.balance.byId || initialState.byId

export const sbtcLoanLockBalanceSelector = createSelector(
  accountLoansSelector,
  (loans) => {
    const lockBalance = loans.reduce((balance, loan) => {
      if (loan && loan.collateral_balance_available) {
        return balance + loan.collateral_balance_available
      }

      return balance
    }, 0)

    return lockBalance
  }
)

export const activeBalanceSelector = createSelector(
  activeWalletSelector,
  balanceAllIdsSelector,
  balanceByIdSelector,
  sbtcLoanLockBalanceSelector,
  (activeWallet, balanceAllIds, balanceById, sbtcLoanLockBalance) => {
    if (!activeWallet) return []

    const chain = activeWallet.chain
    const address = activeWallet.address
    const balanceIds = balanceAllIds.filter(id => id.indexOf(`${chain}/${address}`) !== -1)
    const balances = balanceIds.map(id => balanceById[id]).sort((a, b) => String(a.symbol).localeCompare(String(b.symbol)))
    const riotIndex = balances.findIndex(item => item.symbol === 'DFX')
    const riotBalance = balances.splice(riotIndex, 1)
    let balanceList = [...riotBalance, ...balances]

    const sbtcSavingLockBalance = balanceList.filter(item => item.id.indexOf('/RS P') !== -1).reduce((total, balance) => (total + balance.freeBalance), 0)

    let sbtcLockBalance = 0

    if (sbtcSavingLockBalance) sbtcLockBalance += sbtcSavingLockBalance
    if (sbtcLoanLockBalance) sbtcLockBalance += sbtcLoanLockBalance

    if (sbtcLockBalance) {
      balanceList = balanceList.map((item) => {
        if (item.symbol === 'BTC') {
          return { ...item, lockBalance: sbtcLockBalance }
        }

        return item
      })
    }

    balanceList = balanceList.map((item) => {
      let totalBalance = item.freeBalance
      if (item.lockBalance) {
        totalBalance += item.lockBalance
      }

      return { ...item, totalBalance }
    })

    return balanceList
  }
)

export const sbtcSavingLockBalanceSelector = createSelector(
  activeBalanceSelector,
  (balance) => {
    const sbtcLockBalance = balance.filter(item => item.id.indexOf('/RS P') !== -1).reduce((total, balance) => (total + balance.freeBalance), 0)
    return sbtcLockBalance
  }
)

export const sbtcLockBalanceSelector = createSelector(
  sbtcSavingLockBalanceSelector,
  sbtcLoanLockBalanceSelector,
  (savingLock, loanLock) => {
    let lock = 0

    if (savingLock) lock += savingLock
    if (loanLock) lock += loanLock

    return lock
  }
)

export const sbtcBalanceSelector = createSelector(
  activeBalanceSelector,
  (balance) => {
    const sbtcBalance = balance.filter(item => item.id.indexOf('/SBTC') !== -1 || item.id.indexOf('/BTC') !== -1)
    return sbtcBalance.length ? sbtcBalance[0] : null
  }
)

export const activeAssetBalanceSelector = createSelector(
  activeBalanceSelector,
  activeAssetIdSelector,
  (activeBalance, activeAssetId) => {
    const activeAssetBalance = activeBalance.find(item => item.id === activeAssetId)
    return activeAssetBalance
  }
)

export const rbtcBalanceSelector = createSelector(
  activeBalanceSelector,
  (balance) => {
    const rbtcBalance = balance.filter(item => item.id.indexOf('/RBTC') !== -1)
    return rbtcBalance.length ? rbtcBalance[0] : null
  }
)

export const riotBalanceSelector = createSelector(
  activeBalanceSelector,
  (balance) => {
    const rioBalance = balance.filter(item => item.id.indexOf('SYSCOIN') !== -1)
    return rioBalance.length ? rioBalance[0] : null
  }
)

export const rioBalanceSelector = createSelector(
  activeBalanceSelector,
  (balance) => {
    const rioBalance = balance.filter(item => item.id.indexOf('/RIO') !== -1 && item.id.indexOf('/DFX') === -1)
    return rioBalance.length ? rioBalance[0] : null
  }
)

export const phaseListBalanceSelector = createSelector(
  activeBalanceSelector,
  phaseListSelector,
  (balance, phaseList) => {
    if (!balance || !balance.length || !phaseList || !phaseList.length) {
      return []
    }

    const rscBalance = balance.filter(item => item.symbol.indexOf('RS P') !== -1 && !!item.freeBalance).map((item) => {
      const findPhase = phaseList.find(phase => phase.iou_asset_id === item.contract)
      return { ...item, ...findPhase }
    })
    if (!rscBalance || !rscBalance.length) return []

    return rscBalance
  }
)

export const selectedPhaseAssetBalanceSelector = createSelector(
  phaseListBalanceSelector,
  selectedPhaseAssetIdSelector,
  (balance, phaseAssetId) => {
    if (!balance || !balance.length) return null

    const phaseAssetBalance = balance.find(item => item.contract == phaseAssetId) // eslint-disable-line
    return phaseAssetBalance || balance.slice(-1)[0]
  }
)
