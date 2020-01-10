import { definexApi, definexScanApi } from 'api'

export const getBitcoinDepositAddress = ({ address }) => definexApi('GET', `/wallets/deposit/address/btc/${address}`, {})
export const getWalletDepositHistory = ({ address }) => definexApi('GET', `/wallets/deposit/history/btc/${address}`, {})
export const getWalletWithdrawHistory = ({ address }) => definexApi('GET', `/wallets/withdraw/history/${address}`, {})

export const getTransactionHistory = ({ address, pageSize }) => definexScanApi('GET', '/extrinsic', { 'filter[address]': address, 'page[size]': pageSize || 25 })
export const getTransferTransactionHistory = ({ address }) => definexScanApi('GET', `/asset/transfer/history/${address}`, {}) // eslint-disable-line
export const getLoanTransactionHistory = ({ address }) => definexScanApi('GET', `/loan/history/${address}`, {}) // eslint-disable-line
export const getSavingTransactionHistory = ({ address }) => definexScanApi('GET', `/saving/history/${address}`, {}) // eslint-disable-line
export const withdrawBitcoin = params => definexApi('POST', '/wallets/withdraw/btc/request', params)
