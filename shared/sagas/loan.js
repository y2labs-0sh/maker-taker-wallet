import { eventChannel } from 'redux-saga'
import { takeEvery, takeLatest, call, put, select, all, race, take } from 'redux-saga/effects'
import { fetchPolkaApi } from 'sagas/socket'
import { listenChannel } from 'sagas/channel'
import * as actions from 'actions/loan'
import { activeWalletSelector } from 'selectors/wallet'
import { channelSelector } from 'selectors/channel'
import { getTransactionExecutor } from 'sagas/wallet'
import * as chain from 'core/chain'
import * as channelActions from 'actions/channel'
import { getWalletUniqueInfo, getChannelId } from 'utils'

function* getLoanAccountId() {
  try {
    const api = yield call(fetchPolkaApi)
    const accountId = yield call(api.query.loan.pawnShop)
    yield put(actions.updateLoanAccountId(String(accountId)))
    yield put(actions.getLoanAccountId.succeeded())
  } catch (error) {
    yield put(actions.getLoanAccountId.failed(error.message))
  }
}

function* getCollateralAssetId() {
  try {
    const api = yield call(fetchPolkaApi)
    const assetId = yield call(api.query.loan.collateralAssetId)
    yield put(actions.updateCollateralAssetId(Number(assetId)))
    yield put(actions.getCollateralAssetId.succeeded())
  } catch (error) {
    yield put(actions.getCollateralAssetId.failed(error.message))
  }
}

function* getLoanAssetId() {
  try {
    const api = yield call(fetchPolkaApi)
    const assetId = yield call(api.query.loan.loanAssetId)
    yield put(actions.updateLoanAssetId(Number(assetId)))
    yield put(actions.getLoanAssetId.succeeded())
  } catch (error) {
    yield put(actions.getLoanAssetId.failed(error.message))
  }
}

function* getLiquidationThresholdLimit() {
  try {
    const api = yield call(fetchPolkaApi)
    const result = yield call(api.query.loan.globalLTVLimit)
    yield put(actions.updateLiquidationThresholdLimit(Number(result) / 10000))
    yield put(actions.getLiquidationThresholdLimit.succeeded())
  } catch (error) {
    yield put(actions.getLiquidationThresholdLimit.failed(error.message))
  }
}

function* getGlobalLiquidationThreshold() {
  try {
    const api = yield call(fetchPolkaApi)
    const result = yield call(api.query.loan.globalLiquidationThreshold)
    yield put(actions.updateGlobalLiquidationThreshold(Number(result) / 10000))
    yield put(actions.getGlobalLiquidationThreshold.succeeded())
  } catch (error) {
    yield put(actions.getGlobalLiquidationThreshold.failed(error.message))
  }
}

function* getNextLoanPackageId() {
  try {
    const api = yield call(fetchPolkaApi)
    const result = yield call(api.query.loan.nextLoanPackageId)
    yield put(actions.updateNextLoanPackageId(Number(result)))
    yield put(actions.getNextLoanPackageId.succeeded())
  } catch (error) {
    yield put(actions.getNextLoanPackageId.failed(error.message))
  }
}

function* getActiveLoanPackage() {
  try {
    const api = yield call(fetchPolkaApi)
    const result = yield call(api.query.loan.activeLoanPackages)
    const packages = result[1].map(item => ({
      id: String(item.id),
      status: String(item.status),
      terms: String(item.terms),
      min: Number(item.min) / 100000000,
      interest_rate_hourly: Number(item.interest_rate_hourly) / 100000000,
      collateral_asset_id: String(item.collateral_asset_id),
      loan_asset_id: String(item.loan_asset_id)
    }))
    yield put(actions.updateActiveLoanPackage(packages))
    yield put(actions.getActiveLoanPackage.succeeded())
  } catch (error) {
    yield put(actions.getActiveLoanPackage.failed(error.message))
  }
}

function* createLoansChannel(walletInfo) {
  const api = yield call(fetchPolkaApi)

  return eventChannel((emit) => {
    let unsubscribeAction

    api.query.loan.loansByAccount(walletInfo.address, (result) => {
      emit(actions.receiveLoanIds({ walletInfo, ids: JSON.parse(String(result)) }))
    }).then((cancel) => {
      unsubscribeAction = cancel
    })

    const unsubscribe = () => {
      if (unsubscribeAction) unsubscribeAction()
    }

    return unsubscribe
  })
}

function* receiveLoanIds(action) {
  try {
    const { ids, walletInfo } = action.payload
    const api = yield call(fetchPolkaApi)
    const loanList = (yield all(ids.map(id => call(api.query.loan.loans, id)))).map(res => ({
      id: String(res[0].id),
      package_id: String(res[0].package_id),
      status: String(res[0].status),
      who: String(res[0].who),
      due: +String(res[0].due),
      due_extend: +String(res[0].due_extend),
      collateral_balance: Number(res[0].collateral_balance_original) / 100000000,
      collateral_balance_available: Number(res[0].collateral_balance_available) / 100000000,
      loan_balance_total: Number(res[0].loan_balance_total) / 100000000
    }))
    yield put(actions.updateLoans({ ...walletInfo, items: loanList }))
  } catch (error) {
    console.error(error)
  }
}

function* unsubscribeLoans(listeningChannelId) {
  let unsubscribed = false

  while (!unsubscribed) {
    const { payload } = yield take(actions.unsubscribeLoans)
    const channelId = payload
    unsubscribed = listeningChannelId === channelId
  }

  return unsubscribed
}

function* subscribeLoans() {
  const activeWallet = yield select(activeWalletSelector)
  const walletInfo = getWalletUniqueInfo(activeWallet)
  const channels = yield select(channelSelector)
  const channelId = getChannelId('loan', walletInfo.id)
  if (channels[channelId]) return
  yield put(channelActions.create({ channelId }))

  const channel = yield call(createLoansChannel, walletInfo)

  const { unsubscribe } = yield race(({
    task: call(listenChannel, channel),
    unsubscribe: call(unsubscribeLoans, channelId)
  }))

  if (unsubscribe && unsubscribe.payload === channelId) {
    channel.close()
    yield put(channelActions.close(channelId))
  }
}

function* getLoans() {
  try {
    const api = yield call(fetchPolkaApi)
    const activeWallet = yield select(activeWalletSelector)
    const result = yield call(api.query.loan.loansByAccount, activeWallet.address)
    const walletInfo = getWalletUniqueInfo(activeWallet)
    yield put(actions.receiveLoanIds({ walletInfo, ids: JSON.parse(String(result)) }))
    yield put(actions.getLoans.succeeded())
  } catch (error) {
    yield put(actions.getLoans.failed(error.message))
  }
}

function* getCurrentBTCPrice() {
  try {
    const api = yield call(fetchPolkaApi)
    const result = yield call(api.query.loan.currentBTCPrice)
    yield put(actions.updateCurrentBTCPrice(Number(result) / 10000))
    yield put(actions.getCurrentBTCPrice.succeeded())
  } catch (error) {
    yield put(actions.getCurrentBTCPrice.failed(error.message))
  }
}

function* createBTCPriceChannel() {
  const api = yield call(fetchPolkaApi)

  return eventChannel((emit) => {
    let unsubscribeAction

    api.query.loan.currentBTCPrice((result) => {
      emit(actions.updateCurrentBTCPrice(Number(result) / 10000))
    }).then((cancel) => {
      unsubscribeAction = cancel
    })

    const unsubscribe = () => {
      if (unsubscribeAction) unsubscribeAction()
    }

    return unsubscribe
  })
}

function* subscribeBTCPrice() {
  const channels = yield select(channelSelector)
  const channelId = 'btcPrice'
  if (channels[channelId]) return
  yield put(channelActions.create({ channelId }))

  const channel = yield call(createBTCPriceChannel)

  const { unsubscribe } = yield race(({
    task: call(listenChannel, channel),
    unsubscribe: take(actions.unsubscribeBTCPrice)
  }))

  if (unsubscribe) {
    channel.close()
    yield put(channelActions.close(channelId))
  }
}

function* getGlobalWarningThreshold() {
  try {
    const api = yield call(fetchPolkaApi)
    const result = yield call(api.query.loan.globalWarningThreshold)
    yield put(actions.updateGlobalWarningThreshold(Number(result) / 10000))
    yield put(actions.getGlobalWarningThreshold.succeeded())
  } catch (error) {
    yield put(actions.getGlobalWarningThreshold.failed(error.message))
  }
}

// function* getLiquidatingLoans() {
//   try {
//     const api = yield call(fetchPolkaApi)
//     const result = yield call(api.query.loan.liquidatingLoans)
//     yield put(actions.updateLiquidationLoans(JSON.parse(String(result))[1]))
//     yield put(actions.getLiquidatingLoans.succeeded())
//   } catch (error) {
//     yield put(actions.getLiquidatingLoans.failed(error.message))
//   }
// }

function* repay(action) {
  const { onSuccess, onError, loanId } = action.payload

  try {
    const sender = yield call(getTransactionExecutor)
    yield call(chain.repay, sender, loanId)
    yield put(actions.repay.succeeded())
    onSuccess()
  } catch (error) {
    yield put(actions.repay.failed(error.message))
    onError(error.message)
  }
}

function* applyLoan(action) {
  const { onSuccess, onError, btcAmount, rioAmount, packageId } = action.payload

  try {
    const sender = yield call(getTransactionExecutor)
    yield call(chain.loan, sender, btcAmount, rioAmount, packageId)
    yield put(actions.applyLoan.succeeded())
    onSuccess()
  } catch (error) {
    yield put(actions.applyLoan.failed(error.message))
    onError(error.message)
  }
}

function* addCollateral(action) {
  const { onSuccess, onError, loanId, amount } = action.payload

  try {
    const sender = yield call(getTransactionExecutor)
    yield call(chain.addCollateral, sender, loanId, amount)
    yield put(actions.addCollateral.succeeded())
    onSuccess()
  } catch (error) {
    yield put(actions.addCollateral.failed(error.message))
    onError(error.message)
  }
}

function* borrow(action) {
  const { onSuccess, onError, loanId, amount } = action.payload

  try {
    const sender = yield call(getTransactionExecutor)
    yield call(chain.draw, sender, loanId, amount)
    yield put(actions.borrow.succeeded())
    onSuccess()
  } catch (error) {
    yield put(actions.borrow.failed(error.message))
    onError(error.message)
  }
}

export default function* loanSaga() {
  yield takeEvery(actions.getLoanAccountId.requested, getLoanAccountId)
  yield takeEvery(actions.getCollateralAssetId.requested, getCollateralAssetId)
  yield takeEvery(actions.getLoanAssetId.requested, getLoanAssetId)
  yield takeEvery(actions.getLiquidationThresholdLimit.requested, getLiquidationThresholdLimit)
  yield takeEvery(actions.getGlobalLiquidationThreshold.requested, getGlobalLiquidationThreshold)
  yield takeEvery(actions.getNextLoanPackageId.requested, getNextLoanPackageId)
  yield takeEvery(actions.getActiveLoanPackage.requested, getActiveLoanPackage)
  yield takeEvery(actions.getLoans.requested, getLoans)
  yield takeEvery(actions.subscribeLoans, subscribeLoans)
  yield takeEvery(actions.getCurrentBTCPrice.requested, getCurrentBTCPrice)
  yield takeEvery(actions.subscribeBTCPrice, subscribeBTCPrice)
  yield takeEvery(actions.getGlobalWarningThreshold.requested, getGlobalWarningThreshold)
  // yield takeEvery(actions.getLiquidatingLoans.requested, getLiquidatingLoans)
  yield takeLatest(actions.applyLoan.requested, applyLoan)
  yield takeLatest(actions.repay.requested, repay)
  yield takeLatest(actions.addCollateral.requested, addCollateral)
  yield takeLatest(actions.borrow.requested, borrow)
  yield takeEvery(actions.receiveLoanIds, receiveLoanIds)
}
