// import { createSelector } from 'reselect'
import { CHAIN_API } from 'constants/env'

export const isPolkaNodeConnectedSelector = state => state.socket && state.socket[CHAIN_API] && state.socket[CHAIN_API].isConnecting
