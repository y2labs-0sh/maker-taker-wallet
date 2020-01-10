// import { createSelector } from 'reselect'
import { RIO_CHAIN_API } from 'constants/env'

export const isPolkaNodeConnectedSelector = state => state.socket && state.socket[RIO_CHAIN_API] && state.socket[RIO_CHAIN_API].isConnecting
