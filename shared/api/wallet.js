import { riodefiApi, riodefiScanApi } from 'api'

export const getBitcoinDepositAddress = ({ address }) => riodefiApi('GET', `/wallets/deposit/address/btc/${address}`, {})
export const getWalletDepositHistory = ({ address }) => riodefiApi('GET', `/wallets/deposit/history/btc/${address}`, {})
export const getWalletWithdrawHistory = ({ address }) => riodefiApi('GET', `/wallets/withdraw/history/${address}`, {})

export const getTransactionHistory = ({ address, pageSize }) => riodefiScanApi('GET', '/extrinsic', { 'filter[address]': address, 'page[size]': pageSize || 25 })
export const getTransferTransactionHistory = ({ address }) => riodefiScanApi('GET', `/asset/transfer/history/${address}`, {}) // eslint-disable-line
export const getLoanTransactionHistory = ({ address }) => riodefiScanApi('GET', `/loan/history/${address}`, {}) // eslint-disable-line
export const getSavingTransactionHistory = ({ address }) => riodefiScanApi('GET', `/saving/history/${address}`, {}) // eslint-disable-line
export const withdrawBitcoin = params => riodefiApi('POST', '/wallets/withdraw/btc/request', params)
