import { takeEvery } from 'redux-saga/effects'
import * as actions from 'actions/intl'

function setLocale() {}

export default function* intlSaga() {
  yield takeEvery(actions.setLocale, setLocale)
}
