import assert from 'assert'
import { takeEvery, call, put, select, race, take } from 'redux-saga/effects'
import * as actions from 'actions/socket'
import { isPolkaNodeConnectedSelector } from 'selectors/socket'
import { activeEndPointUrlSelector } from 'selectors/endPoint'
import { polkaApi } from 'core/chain'
import { RIO_CHAIN_API } from 'constants/env'

function* connect(action) {
  const activeEndPoint = yield select(activeEndPointUrlSelector)
  const baseUrl = action.payload || activeEndPoint || RIO_CHAIN_API

  try {
    yield call(polkaApi, baseUrl)
    yield put(actions.connectSucceeded(baseUrl))
  } catch (error) {
    yield put(actions.connectFailed())
  }
}

export function* fetchPolkaApi() {
  const isConnected = yield select(isPolkaNodeConnectedSelector)

  if (!isConnected) {
    const { failed } = yield race({
      connected: take(actions.connectSucceeded),
      failed: take(actions.connectFailed)
    })

    assert(!failed, 'polka api connection failed')
  }

  const api = yield call(polkaApi)
  return api
}

export default function* socketSaga() {
  yield takeEvery(actions.connect, connect)
}
