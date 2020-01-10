import { createAction } from 'redux-actions'

export const pend = createAction('queue/PEND')
export const execute = createAction('queue/EXECUTE')
export const empty = createAction('queue/EXECUTE')
