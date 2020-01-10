import { all, fork } from 'redux-saga/effects'
import { ENV } from 'constants/env'
import loggerSaga from './logger'
import intlSaga from './intl'
import walletSaga from './wallet'
import balanceSaga from './balance'
import transactionSaga from './transaction'
import stakeSaga from './stake'
import loanSaga from './loan'
import socketSaga from './socket'
import endPointSaga from './endPoint'
import chainSaga from './chain'

const sagas = {
  loggerSaga: fork(loggerSaga),
  intlSaga: fork(intlSaga),
  walletSaga: fork(walletSaga),
  balanceSaga: fork(balanceSaga),
  transactionSaga: fork(transactionSaga),
  stakeSaga: fork(stakeSaga),
  loanSaga: fork(loanSaga),
  socketSaga: fork(socketSaga),
  endPointSaga: fork(endPointSaga),
  chainSaga: fork(chainSaga)
}

if (ENV === 'production') {
  delete sagas.loggerSaga
}

export default function* rootSaga() {
  yield all(sagas)
}
