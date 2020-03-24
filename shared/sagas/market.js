// import assert from 'assert'
// import { takeEvery, call, put, select } from 'redux-saga/effects'
import { takeEvery, call, put } from 'redux-saga/effects'

import * as actions from 'actions/market'
// import * as api from 'api/wallet'
// import { activeWalletSelector } from 'selectors/wallet'
import { getTransactionExecutor } from 'sagas/wallet'
import * as chain from 'core/chain'

function* addBorrow(action) {
  if (!action.payload) return
  const { onSuccess, onError, ...params } = action.payload

  try {
    const { borrowId, amount } = params
    const sender = yield call(getTransactionExecutor)
    yield call(chain.addBorrow, sender, borrowId, amount)
    yield put(actions.addBorrow.succeeded())
    onSuccess()
  } catch (error) {
    yield put(actions.addBorrow.failed(error.message))
    onError(error.message)
  }
}

function* lendBorrow(action){
  if (!action.payload) return
  const { onSuccess, onError, ...params } = action.payload
  try {
    const { borrowId } = params
    const sender = yield call(getTransactionExecutor)
    yield call(chain.lendBorrow, sender, borrowId)
    yield put(actions.lendBorrow.succeeded)
    onSuccess()
  } catch (error) {
    yield put(actions.lendBorrow.failed(error.message))
    onError(error.message)
  }
}

function* repayBorrow(action){
  if (!action.payload) return
  const { onSuccess, onError, ...params } = action.payload
  try {
    const { borrowId } = params
    const sender = yield call(getTransactionExecutor)
    yield call(chain.repayBorrow, sender, borrowId)
    yield put(actions.lendBorrow.succeeded)
    onSuccess()
  } catch (error) {
    yield put(actions.lendBorrow.failed(error.message))
    onError(error.message)
  }
}

function* makeBorrow(action){
  if (!action.payload) return
  const { onSuccess, onError, ...params } = action.payload
  try {
    const { collateral_balance, trading_pair, borrow_options } = params
    const sender = yield call(getTransactionExecutor)
    yield call(chain.makeBorrow, sender, collateral_balance, trading_pair, borrow_options)
    yield put(actions.lendBorrow.succeeded)
    onSuccess()
  } catch (error) {
    yield put(actions.lendBorrow.failed(error.message))
    onError(error.message)
  }
}

function* cancelBorrow(action){
  if (!action.payload) return
  const { onSuccess, onError, ...params } = action.payload
  try {
    const { borrowId } = params
    const sender = yield call(getTransactionExecutor)
    yield call(chain.repayBorrow, sender, borrowId)
    yield put(actions.cancelBorrow.succeeded)
    onSuccess()
  } catch (error) {
    yield put(actions.cancelBorrow.failed(error.message))
    onError(error.message)
  }
}

export default function* marketSaga() {
  yield takeEvery(actions.addBorrow.requested, addBorrow)
  yield takeEvery(actions.lendBorrow.requested, lendBorrow)
  yield takeEvery(actions.repayBorrow.requested, repayBorrow)
  yield takeEvery(actions.makeBorrow.requested, makeBorrow)
  yield takeEvery(actions.cancelBorrow.requested, cancelBorrow)
}
