import { createAction } from 'redux-actions'

export const connect = createAction('socket/CONNECT')
export const connectSucceeded = createAction('socket/CONNECT_SUCCEEDED')
export const connectFailed = createAction('socket/CONNECT_FAILED')
export const disconnect = createAction('socket/DISCONNECT')
