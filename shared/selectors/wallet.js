import { createSelector } from 'reselect'
import createCachedSelector from 're-reselect'
import { initialState } from 'reducers/wallet'
import { getWalletUniqueInfo } from 'utils'

export const activeWalletIdSelector = state => state.wallet.activeWalletId || initialState.activeWalletId
export const walletAllIdsSelector = state => state.wallet.allIds || initialState.allIds
const walletByIdSelector = state => state.wallet.byId || initialState.byId

export const activeWalletSelector = createSelector(
  activeWalletIdSelector,
  walletByIdSelector,
  (activeWalletId, wallets) => activeWalletId && wallets[activeWalletId]
)

export const walletSelectorById = createCachedSelector(
  walletByIdSelector,
  (state, walletId) => walletId,
  (byId, walletId) => byId[walletId]
)(
  (state, walletId) => walletId
)

export const activeWalletUniqueInfoSelector = createSelector(
  activeWalletSelector,
  activeWallet => getWalletUniqueInfo(activeWallet)
)

export const allWalletsSelector = createSelector(
  walletAllIdsSelector,
  walletByIdSelector,
  (allIds, byId) => allIds.map(id => byId[id])
)

export const activeWalletBTCDepositAddressSelector = createSelector(
  activeWalletSelector,
  activeWallet => activeWallet && activeWallet.btcDepositAddress
)
