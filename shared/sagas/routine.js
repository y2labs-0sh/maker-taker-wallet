import assert from 'assert'
import { take, race, put } from 'redux-saga/effects'
import * as actions from 'actions/password'

export function* requestPassword() {
  yield put(actions.requestPassword())

  const { submit, cancel } = yield race({
    submit: take(actions.submitPassword),
    cancel: take(actions.cancelPassword)
  })

  assert(!cancel, 'user canceled the password request')

  return submit.payload.password
}
/*
 * export function* requestAction() {
 *   yield put(actions.requestAction())
 *
 *   const { submit, cancel } = yield race({
 *     submit: call(actions.submitPassword),
 *     cancel: take(actions.cancelAction)
 *   })
 *
 *   assert(!cancel, 'user canceled the action')
 *
 *   return submit.payload.password
 * } */
