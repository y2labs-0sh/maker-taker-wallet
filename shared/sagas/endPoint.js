import { takeEvery, select, all, call, put } from 'redux-saga/effects'
import { endPointAllIdsSelector } from 'selectors/endPoint'
import * as actions from 'actions/endPoint'
import { getChainStatus, disconnectApi } from 'core/chain'

function* getEndPointStatus() {
  try {
    const endPointUrls = yield select(endPointAllIdsSelector)
    const result = yield all(endPointUrls.map(url => call(getChainStatus, url)))
    yield put(actions.updateEndPointStatus(result))
    yield put(actions.getEndPointStatus.succeeded(result))
  } catch (error) {
    yield put(actions.getEndPointStatus.failed(error.message))
  }
}

function* deleteEndPoint(action) {
  const url = action.payload
  yield call(disconnectApi, url)
}

export default function* endPointSaga() {
  yield takeEvery(actions.getEndPointStatus.requested, getEndPointStatus)
  yield takeEvery(actions.deleteEndPoint, deleteEndPoint)
}
