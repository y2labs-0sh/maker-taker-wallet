import assert from 'assert'
import { takeEvery, call, put, select } from 'redux-saga/effects'
import * as actions from 'actions/transaction'
import * as api from 'api/wallet'
import { activeWalletSelector } from 'selectors/wallet'
import { getWalletUniqueInfo } from 'utils'
import { getTransactionExecutor } from 'sagas/wallet'
import * as chain from 'core/chain'

function* getWalletDepositHistory() {
  const activeWallet = yield select(activeWalletSelector)
  const walletInfo = getWalletUniqueInfo(activeWallet)

  try {
    const address = walletInfo.address
    const { items } = yield call(api.getWalletDepositHistory, { address })
    assert(items, 'No deposit history')
    yield put(actions.updateWalletDepositWithdrawHistory({ ...walletInfo, items }))
    yield put(actions.getWalletDepositHistory.succeeded())
  } catch (error) {
    yield put(actions.getWalletDepositHistory.failed(error.message))
  }
}

function* getWalletWithdrawHistory() {
  const activeWallet = yield select(activeWalletSelector)
  const walletInfo = getWalletUniqueInfo(activeWallet)

  try {
    const address = walletInfo.address
    const { items } = yield call(api.getWalletWithdrawHistory, { address })
    yield put(actions.updateWalletDepositWithdrawHistory({ ...walletInfo, items }))
    yield put(actions.getWalletWithdrawHistory.succeeded())
  } catch (error) {
    yield put(actions.getWalletWithdrawHistory.failed(error.message))
  }
}

function* getTransactionHistory() {
  const activeWallet = yield select(activeWalletSelector)
  const walletInfo = getWalletUniqueInfo(activeWallet)

  try {
    const address = walletInfo.address
    const response = yield call(api.getTransactionHistory, { address })
    yield put(actions.updateTransactionHistory({ ...walletInfo, items: response }))
    yield put(actions.getTransactionHistory.succeeded())
  } catch (error) {
    yield put(actions.getTransactionHistory.failed(error.message))
  }
}

function* getTransferTransactionHistory() {
  const activeWallet = yield select(activeWalletSelector)
  const walletInfo = getWalletUniqueInfo(activeWallet)

  try {
    const address = walletInfo.address
    const response = yield call(api.getTransferTransactionHistory, { address })
    yield put(actions.updateTransferTransactionHistory({ ...walletInfo, items: response }))
    yield put(actions.getTransferTransactionHistory.succeeded())
  } catch (error) {
    yield put(actions.getTransferTransactionHistory.failed(error.message))
  }
}

function* getLoanTransactionHistory() {
  const activeWallet = yield select(activeWalletSelector)
  const walletInfo = getWalletUniqueInfo(activeWallet)

  try {
    const address = walletInfo.address
    const response = yield call(api.getLoanTransactionHistory, { address })
    yield put(actions.updateLoanTransactionHistory({ ...walletInfo, items: response }))
    yield put(actions.getLoanTransactionHistory.succeeded())
  } catch (error) {
    yield put(actions.getLoanTransactionHistory.failed(error.message))
  }
}

function* getSavingTransactionHistory() {
  const activeWallet = yield select(activeWalletSelector)
  const walletInfo = getWalletUniqueInfo(activeWallet)

  try {
    const address = walletInfo.address
    const response = yield call(api.getSavingTransactionHistory, { address })
    console.log('getSavingTransactionHistory', response)
    yield put(actions.updateSavingTransactionHistory({ ...walletInfo, items: response }))
    yield put(actions.getSavingTransactionHistory.succeeded())
  } catch (error) {
    yield put(actions.getSavingTransactionHistory.failed(error.message))
  }
}

function* transferAsset(action) {
  if (!action.payload) return
  const { onSuccess, onError, ...params } = action.payload

  try {
    const { amount, receiver, assetId } = params
    const sender = yield call(getTransactionExecutor)
    yield call(chain.transfer, sender, amount, receiver, assetId === 'SYSCOIN' ? null : assetId)
    yield put(actions.transferAsset.succeeded())
    onSuccess()
  } catch (error) {
    yield put(actions.transferAsset.failed(error.message))
    onError(error.message)
  }
}

export default function* transactionSaga() {
  yield takeEvery(actions.getWalletDepositHistory.requested, getWalletDepositHistory)
  yield takeEvery(actions.getWalletWithdrawHistory.requested, getWalletWithdrawHistory)
  yield takeEvery(actions.transferAsset.requested, transferAsset)
  yield takeEvery(actions.getTransactionHistory.requested, getTransactionHistory)

  yield takeEvery(actions.getTransferTransactionHistory.requested, getTransferTransactionHistory)
  yield takeEvery(actions.getLoanTransactionHistory.requested, getLoanTransactionHistory)
  yield takeEvery(actions.getSavingTransactionHistory.requested, getSavingTransactionHistory)
}
