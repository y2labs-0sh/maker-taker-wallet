import { createAsyncAction } from 'redux-helper'
import { createAction } from 'redux-actions'

export const createPolkadotWallet = createAsyncAction('wallet/CREATE_POLKADOT_WALET')
export const importPolkadotWallet = createAsyncAction('wallet/IMPOT_POLKADOT_WALLET')
export const deletePolkadotWallet = createAsyncAction('wallet/DELETE_POLKADOT_WALLET')
export const exportPolkadotKeystore = createAsyncAction('wallet/EXPORT_POLKADOT_KEYSTORE')

export const scanWallets = createAsyncAction('wallet/SCAN_WALLETS')
export const addWallet = createAction('wallet/ADD_WALLET')
export const addWallets = createAction('wallet/ADD_WALLETS')
export const mergeWallets = createAction('wallet/MERGE_WALLETS')
export const setActiveWallet = createAction('wallet/SET_ACTIVE_WALLET')
export const removeWallet = createAction('wallet/REMOVE')
export const resetWallet = createAction('wallet/RESET')
export const updateWalletName = createAction('wallet/UPDATE_NAME')
export const importWalletBySuri = createAsyncAction('wallet/IMPORT_SURI')
export const importWalletByKeystore = createAsyncAction('wallet/IMPORT_KEYSTORE')

export const getBitcoinDepositAddress = createAsyncAction('wallet/GET_BITCOIN_DEPOSIT_ADDRESS')
export const updateBitcoinDepositAddress = createAction('wallet/UPDATE_BITCOIN_DEPOSIT_ADDRESS')

export const withdrawBitcoin = createAsyncAction('wallet/WITHDRAW_BITCOIN')
