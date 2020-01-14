import assert from 'assert'
import { takeEvery, call, put, select } from 'redux-saga/effects'
import * as actions from 'actions/stake'
import { subscribeBalance } from 'actions/balance'
import { sbtcAssetIdSelector } from 'selectors/stake'
import { getTransactionExecutor } from 'sagas/wallet'
import { fetchPolkaApi } from 'sagas/socket'
import * as chain from 'core/chain'

function* getSBTCAssetId(action) {
  try {
    const api = yield call(fetchPolkaApi, action)
    const assetId = yield call(api.query.saving.collectionAssetId)
    yield put(actions.updateSBTCAssetId(Number(assetId)))
    yield put(actions.getSBTCAssetId.succeeded())
    yield put(subscribeBalance({ assetId: Number(assetId), symbol: 'BTC' }))
  } catch (error) {
    yield put(actions.getSBTCAssetId.failed(error.message))
  }
}

function* getRBTCAssetId(action) {
  try {
    const api = yield call(fetchPolkaApi, action)
    const assetId = yield call(api.query.saving.shareAssetId)
    yield put(actions.updateRBTCAssetId(Number(assetId)))
    yield put(actions.getRBTCAssetId.succeeded())
    yield put(subscribeBalance({ assetId: Number(assetId), symbol: 'RBTC' }))
  } catch (error) {
    yield put(actions.getRBTCAssetId.failed(error.message))
  }
}

function* getSavingAccountId(action) {
  try {
    const api = yield call(fetchPolkaApi, action)
    const accountId = yield call(api.query.saving.collectionAccountId)
    yield put(actions.updateSavingAccountId(String(accountId)))
    yield put(actions.getSavingAccountId.succeeded())
  } catch (error) {
    yield put(actions.getSavingAccountId.failed(error.message))
  }
}

function* getCurrentPhaseId(action) {
  try {
    const api = yield call(fetchPolkaApi, action)
    const phaseId = yield call(api.query.saving.currentPhaseId)
    yield put(actions.updateCurrentPhaseId(Number(phaseId)))
    yield put(actions.getCurrentPhaseId.succeeded())
    yield put(actions.getCurrentPhaseInfo.requested(Number(phaseId)))
  } catch (error) {
    yield put(actions.getCurrentPhaseId.failed(error.message))
  }
}

function* getCurrentPhaseInfo(action) {
  try {
    const api = yield call(fetchPolkaApi, action)
    const result = yield call(api.query.saving.phaseInfos, action.payload)

    const phaseInfo = {
      id: Number(result[0].id),
      quota: Number(result[0].quota),
      exchange: Number(result[0].exchange),
      iou_asset_id: Number(result[0].iou_asset_id)
    }

    yield put(actions.updateCurrentPhaseInfo(phaseInfo))
    yield put(actions.getCurrentPhaseInfo.succeeded())
  } catch (error) {
    yield put(actions.getCurrentPhaseInfo.failed(error.message))
  }
}

function* getUsedQuota(action) {
  try {
    const api = yield call(fetchPolkaApi, action)
    const result = yield call(api.query.assets.usedQuota)
    console.log(result)
    // yield put(actions.updateUsedQuota(result))
    yield put(actions.getUsedQuota.succeeded())
  } catch (error) {
    yield put(actions.getUsedQuota.failed(error.message))
  }
}

function* stakeBTC(action) {
  if (!action.payload) return
  const { onSuccess, onError, btcAmount } = action.payload

  try {
    const sbtcAssetId = yield select(sbtcAssetIdSelector)
    assert(sbtcAssetId, 'No sbtcAssetId')
    const sender = yield call(getTransactionExecutor)
    yield call(chain.save, sender, btcAmount, sbtcAssetId)
    yield put(actions.stakeBTC.succeeded())
    onSuccess()
  } catch (error) {
    yield put(actions.stakeBTC.failed(error.message))
    onError(error.message)
  }
}

function* unstakeBTC(action) {
  if (!action.payload) return
  const { onSuccess, onError, rscAmount, rscAssetId } = action.payload

  try {
    assert(rscAssetId, 'No rscAssetId')
    const sender = yield call(getTransactionExecutor)
    yield call(chain.redeem, sender, rscAmount, rscAssetId)
    yield put(actions.unstakeBTC.succeeded())
    onSuccess()
  } catch (error) {
    yield put(actions.unstakeBTC.failed(error.message))
    onError(error.message)
  }
}

function* getPhaseList(action) {
  try {
    const api = yield call(fetchPolkaApi, action)
    const result = yield call(api.query.saving.phaseInfos)
    const phaseList = result[1].map(item => ({
      id: Number(item.id),
      quota: Number(item.quota),
      exchange: Number(item.exchange),
      iou_asset_id: Number(item.iou_asset_id)
    }))
    yield put(actions.updatePhaseList(phaseList))
    yield put(actions.getPhaseList.succeeded())
    for (const phase of phaseList) {
      yield put(subscribeBalance({ assetId: phase.iou_asset_id, symbol: `RS P${phase.id}` }))
    }
  } catch (error) {
    yield put(actions.getPhaseList.failed(error.message))
  }
}

export default function* stakeSaga() {
  yield takeEvery(actions.getSavingAccountId.requested, getSavingAccountId)
  yield takeEvery(actions.getSBTCAssetId.requested, getSBTCAssetId)
  yield takeEvery(actions.getRBTCAssetId.requested, getRBTCAssetId)
  yield takeEvery(actions.getCurrentPhaseId.requested, getCurrentPhaseId)
  yield takeEvery(actions.getCurrentPhaseInfo.requested, getCurrentPhaseInfo)
  yield takeEvery(actions.getUsedQuota.requested, getUsedQuota)
  yield takeEvery(actions.getPhaseList.requested, getPhaseList)
  yield takeEvery(actions.stakeBTC.requested, stakeBTC)
  yield takeEvery(actions.unstakeBTC.requested, unstakeBTC)
}
