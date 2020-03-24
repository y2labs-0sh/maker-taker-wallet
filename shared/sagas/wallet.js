import assert from 'assert'
import { takeEvery, takeLatest, call, put, select, delay } from 'redux-saga/effects'
import * as actions from 'actions/wallet'
import { subscribeBalance, unsubscribeBalance, removeWalletBalance } from 'actions/balance'
import { removeWalletChannel } from 'actions/channel'
import { getWalletDepositHistory, getWalletWithdrawHistory } from 'actions/transaction'
import { getSBTCAssetId, getRBTCAssetId, getPhaseList } from 'actions/stake'
import { subscribeLoans, unsubscribeLoans } from 'actions/loan'
import { activeWalletSelector, walletSelectorById, walletAllIdsSelector } from 'selectors/wallet'
import { channelSelectorByAddress } from 'selectors/channel'
import { requestPassword } from 'sagas/password'
import * as wallet from 'core/wallet'
import * as api from 'api/wallet'
import { readFileAsJson, exportFileAsJson } from 'utils'
import { reset } from 'redux-form'

function* scanWallets() {
  try {
    const extensionWallets = yield call(wallet.scanExtensionWallets)
    const localWallets = yield call(wallet.scanWallets)
    const allWallets = [...localWallets, ...extensionWallets]
    yield put(actions.mergeWallets(allWallets))

    if (allWallets.length) {
      const walletId = allWallets[0].id
      yield put(actions.setActiveWallet(walletId))
    }

    yield put(actions.scanWallets.succeeded())
  } catch (error) {
    yield put(actions.scanWallets.failed(error.message))
  }
}

export function* getTransactionExecutor(walletId) {
  const { id, source, address } = yield select(state => walletId ? walletSelectorById(state, walletId) : activeWalletSelector(state))

  let sender
  if (source === 'extension') {
    sender = address
  } else {
    const password = yield call(requestPassword)
    sender = yield call(wallet.exportKeyPair, id, password)
  }

  return sender
}

function* setActiveWallet() {
  yield put(subscribeBalance({ symbol: 'DFX' }))
  yield put(subscribeBalance({ symbol: 'RIO', assetId: 8 }))
  yield put(getWalletDepositHistory.requested())
  yield put(getWalletWithdrawHistory.requested())
  yield put(getSBTCAssetId.requested())
  yield put(getRBTCAssetId.requested())
  yield put(getPhaseList.requested())
  yield put(subscribeLoans())
  yield put(reset('stakeForm'))
  yield put(reset('unstakeForm'))
  yield delay(10000)
}

function* getBitcoinDepositAddress(action) {
  const { id, address } = action.payload || (yield select(activeWalletSelector))

  try {
    const params = { address }
    const result = yield call(api.getBitcoinDepositAddress, params)
    yield put(actions.updateBitcoinDepositAddress({ id, address: result.address }))
    yield put(actions.getBitcoinDepositAddress.succeeded())
  } catch (error) {
    yield put(actions.getBitcoinDepositAddress.failed(error.message))
  }
}

function* withdrawBitcoin(action) {
  if (!action.payload) return
  const { onSuccess, onError, ...params } = action.payload

  try {
    const { fromAddress, toAddress, amount } = params
    const data = {
      fromAddress,
      toAddress,
      amount: +amount,
      asset: 'BTC'
    }

    const { id, source } = yield select(activeWalletSelector)
    assert(source !== 'extension', 'extension does not support sign message')
    const password = yield call(requestPassword)
    const paramText = JSON.stringify(data)
    const signature = yield call(wallet.signData, id, password, paramText)
    yield call(api.withdrawBitcoin, { ...data, signature })
    yield put(actions.withdrawBitcoin.succeeded())
    onSuccess()
  } catch (error) {
    yield put(actions.withdrawBitcoin.failed(error.message))
    onError(error.message)
  }
}

function* importWalletBySuri(action) {
  if (!action.payload) return
  const { onSuccess, onError, ...params } = action.payload

  try {
    const { mnemonics, name, password, passwordHint } = params
    const importedWallet = yield call(
      wallet.importWallet,
      'polkadot',
      'suri',
      mnemonics,
      password,
      {
        name,
        network: 'definex',
        keyPairType: 'sr25519',
        passwordHint
      }
    )
    yield put(actions.addWallet(importedWallet))
    yield put(actions.setActiveWallet(importedWallet.id))
    yield put(actions.importWalletBySuri.succeeded())
    onSuccess()
  } catch (error) {
    yield put(actions.importWalletBySuri.failed(error.message))
    onError(error.message)
  }
}

function* importWalletByKeystore(action) {
  if (!action.payload) return
  const { onSuccess, onError, ...params } = action.payload

  try {
    const { file, name, password, passwordHint } = params
    const keystore = yield call(readFileAsJson, file)
    const importedWallet = yield call(
      wallet.importWallet,
      'polkadot',
      'keystore',
      keystore,
      password,
      {
        name,
        network: 'definex',
        keyPairType: 'sr25519',
        passwordHint
      }
    )
    yield put(actions.addWallet(importedWallet))
    yield put(actions.setActiveWallet(importedWallet.id))
    yield put(actions.importWalletByKeystore.succeeded())
    onSuccess()
  } catch (error) {
    yield put(actions.importWalletByKeystore.failed(error.message))
    onError(error.message)
  }
}

function* exportPolkadotKeystore(action) {
  if (!action.payload) return
  const { onSuccess, onError, ...params } = action.payload

  try {
    const { walletId } = params
    const password = yield call(requestPassword)
    const keystore = yield call(wallet.exportKeystore, walletId, password)
    const address = keystore.address
    yield call(exportFileAsJson, address, keystore)
    yield put(actions.exportPolkadotKeystore.succeeded())
    onSuccess()
  } catch (error) {
    yield put(actions.exportPolkadotKeystore.failed(error.message))
    onError(error.message)
  }
}

function* deletePolkadotWallet(action) {
  if (!action.payload) return
  const { onSuccess, onError, ...params } = action.payload

  try {
    const { walletId } = params
    const password = yield call(requestPassword)
    yield call(wallet.deleteWallet, walletId, password)

    const { id, address } = yield select(activeWalletSelector)

    const activeWalletId = id
    if (activeWalletId === walletId) {
      const allWalletIds = yield select(walletAllIdsSelector)
      const allWalletIdsAfterDelete = allWalletIds.filter(id => id !== walletId)
      if (allWalletIdsAfterDelete.length) {
        const firstWalletId = allWalletIdsAfterDelete[0]
        yield put(actions.setActiveWallet(firstWalletId))
      }
    }
    yield put(actions.removeWallet(walletId))
    yield put(actions.deletePolkadotWallet.succeeded())
    onSuccess()

    const walletBalanceChannelIds = yield select(state => channelSelectorByAddress(state, address, 'balance'))
    for (const channelId of walletBalanceChannelIds) {
      yield put(unsubscribeBalance(channelId))
    }

    const walletLoanChannelIds = yield select(state => channelSelectorByAddress(state, address, 'loan'))
    for (const channelId of walletLoanChannelIds) {
      yield put(unsubscribeLoans(channelId))
    }

    yield put(removeWalletBalance(address))
    yield put(removeWalletChannel(address))
  } catch (error) {
    yield put(actions.deletePolkadotWallet.failed(error.message))
    onError(error.message)
  }
}

export default function* walletSaga() {
  yield takeEvery(actions.scanWallets.requested, scanWallets)
  yield takeEvery(actions.setActiveWallet, setActiveWallet)
  yield takeEvery(actions.getBitcoinDepositAddress.requested, getBitcoinDepositAddress)
  yield takeLatest(actions.withdrawBitcoin.requested, withdrawBitcoin)
  yield takeLatest(actions.importWalletBySuri.requested, importWalletBySuri)
  yield takeLatest(actions.importWalletByKeystore.requested, importWalletByKeystore)
  yield takeLatest(actions.deletePolkadotWallet.requested, deletePolkadotWallet)
  yield takeLatest(actions.exportPolkadotKeystore.requested, exportPolkadotKeystore)
}
