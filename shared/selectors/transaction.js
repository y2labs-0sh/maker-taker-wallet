import { createSelector } from 'reselect'
import { initialState } from 'reducers/transaction'
import { activeWalletSelector } from 'selectors/wallet'
import { assetMap } from 'constants/chain'

// const transactionAllIdsSelector = state => state.transaction.allIds || initialState.allIds
const transactionByIdSelector = state => state.transaction.byId || initialState.byId
const scanTransactionByIdSelector = state => state.transaction.scan.byId || initialState.scan.byId
const loanTransactionByIdSelector = state => state.transaction.loan.byId || initialState.loan.byId
const savingTransactionByIdSelector = state => state.transaction.saving.byId || initialState.saving.byId
const transferTransactionByIdSelector = state => state.transaction.transfer.byId || initialState.transfer.byId

export const activeTransactionSelector = createSelector(
  activeWalletSelector,
  transactionByIdSelector,
  (activeWallet, transactionById) => {
    if (!activeWallet) return []

    const chain = activeWallet.chain
    const address = activeWallet.address
    const transactionInfo = transactionById[`${chain}/${address}`]
    if (!transactionInfo) return []

    const byId = transactionInfo.byId
    const allIds = transactionInfo.allIds

    return allIds.map(id => byId[id])
  }
)

export const activeScanTransactionSelector = createSelector(
  activeWalletSelector,
  scanTransactionByIdSelector,
  (activeWallet, transactionById) => {
    if (!activeWallet) return []

    const chain = activeWallet.chain
    const address = activeWallet.address
    const transactionInfo = transactionById[`${chain}/${address}`]
    if (!transactionInfo) return []

    return transactionInfo.items
  }
)

export const activeLoanTransactionSelector = createSelector(
  activeWalletSelector,
  loanTransactionByIdSelector,
  (activeWallet, transactionById) => {
    if (!activeWallet) return []

    const chain = activeWallet.chain
    const address = activeWallet.address
    const transactionInfo = transactionById[`${chain}/${address}`]
    if (!transactionInfo) return []

    return transactionInfo.items
  }
)

export const activeSavingTransactionSelector = createSelector(
  activeWalletSelector,
  savingTransactionByIdSelector,
  (activeWallet, transactionById) => {
    if (!activeWallet) return []

    const chain = activeWallet.chain
    const address = activeWallet.address
    const transactionInfo = transactionById[`${chain}/${address}`]
    if (!transactionInfo) return []

    return transactionInfo.items.map(item => ({ ...item, asset: assetMap[+item.attributes.asset_id] }))
  }
)

export const activeTransferTransactionSelector = createSelector(
  activeWalletSelector,
  transferTransactionByIdSelector,
  (activeWallet, transactionById) => {
    if (!activeWallet) return []

    const chain = activeWallet.chain
    const address = activeWallet.address
    const transactionInfo = transactionById[`${chain}/${address}`]
    if (!transactionInfo) return []

    return transactionInfo.items.map(item => ({ ...item, asset: assetMap[+item.attributes.asset_id] }))
  }
)
