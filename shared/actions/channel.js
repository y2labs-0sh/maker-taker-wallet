import { createAction } from 'redux-actions'

export const create = createAction('channel/CREATE')
export const close = createAction('channel/CLOSE')
export const removeWalletChannel = createAction('channel/REMOVE_WALLET')
