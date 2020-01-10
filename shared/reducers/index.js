import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { reducer as form } from 'redux-form'
import intl from './intl'
import wallet from './wallet'
import asset from './asset'
import balance from './balance'
import transaction from './transaction'
import password from './password'
import stake from './stake'
import loan from './loan'
import channel from './channel'
import socket from './socket'
import queue from './queue'
import endPoint from './endPoint'
import chain from './chain'
import contact from './contact'
import asyncRoutine from './asyncRoutine'

const createRootReducer = history => combineReducers({
  router: connectRouter(history),
  form,
  intl,
  wallet,
  asset,
  balance,
  transaction,
  password,
  stake,
  loan,
  channel,
  socket,
  queue,
  endPoint,
  chain,
  contact,
  asyncRoutine
})

export default createRootReducer
