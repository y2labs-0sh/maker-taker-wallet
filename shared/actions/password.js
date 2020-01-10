import { createAction } from 'redux-actions'

export const requestPassword = createAction('password/REQUEST')
export const submitPassword = createAction('password/SUBMIT')
export const cancelPassword = createAction('password/CANCEL')
