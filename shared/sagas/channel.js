import { put, take } from 'redux-saga/effects'

export function* listenChannel(channel) {
  while (true) {
    const action = yield take(channel)
    yield put(action)
  }
}
