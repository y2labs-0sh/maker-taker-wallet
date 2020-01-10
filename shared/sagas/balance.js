import assert from 'assert'
import { eventChannel } from 'redux-saga'
import { takeEvery, call, put, take, race, select } from 'redux-saga/effects'
import * as actions from 'actions/balance'
import * as channelActions from 'actions/channel'
import { fetchPolkaApi } from 'sagas/socket'
import { listenChannel } from 'sagas/channel'
import { activeWalletSelector } from 'selectors/wallet'
import { channelSelector } from 'selectors/channel'
import { rbtcAssetIdSelector } from 'selectors/stake'
import { getAssetUniqueInfo, getChannelId } from 'utils'

function handleRBTCLockBalanceResponse(response) {
  const lockBalance = response[0].reduce((total, item) => {
    let lock = 0
    const minor = item.minor
    const major = item.major
    if (minor && minor.per_term && minor.terms_left) lock += ((Number(minor.per_term) / 100000000) * Number(minor.terms_left))
    if (major && major.per_term && major.terms_left) lock += ((Number(major.per_term) / 100000000) * Number(major.terms_left))
    return lock + total
  }, 0)
  return lockBalance
}

function* createBalanceChannel(assetInfo) {
  const api = yield call(fetchPolkaApi)

  return eventChannel((emit) => {
    let unsubscribeFreeBalanceAction
    let unsubscribeLockBalanceAction

    if (!isNaN(assetInfo.contract)) {
      api.query.rioAssetsQuery.freeBalance(assetInfo.contract, assetInfo.address, (balance) => {
        emit(actions.updateBalance({ ...assetInfo, freeBalance: Number(balance) / 100000000 }))
      }).then((cancel) => {
        unsubscribeFreeBalanceAction = cancel
      })

      if (assetInfo.symbol === 'RBTC') {
        api.query.rioSaving.shareUnreleasedList(assetInfo.address, (result) => {
          const lockBalance = handleRBTCLockBalanceResponse(result)
          emit(actions.updateBalance({ ...assetInfo, lockBalance }))
        }).then((cancel) => {
          unsubscribeLockBalanceAction = cancel
        })
      }
    } else {
      api.query.balances.freeBalance(assetInfo.address, (balance) => {
        emit(actions.updateBalance({ ...assetInfo, freeBalance: Number(balance) / 100000000 }))
      }).then((cancel) => {
        unsubscribeFreeBalanceAction = cancel
      })
    }

    const unsubscribe = () => {
      if (unsubscribeFreeBalanceAction) unsubscribeFreeBalanceAction()
      if (unsubscribeLockBalanceAction) unsubscribeLockBalanceAction()
    }

    return unsubscribe
  })
}

function* unsubscribeBalance(listeningChannelId) {
  let unsubscribed = false

  while (!unsubscribed) {
    const { payload } = yield take(actions.unsubscribeBalance)
    const channelId = payload
    unsubscribed = listeningChannelId === channelId
  }

  return unsubscribed
}

function* subscribeBalance(action) {
  try {
    const activeWallet = yield select(activeWalletSelector)
    assert(activeWallet, 'No wallet yet')
    const assetInfo = getAssetUniqueInfo(activeWallet, action.payload)
    const channels = yield select(channelSelector)
    const channelId = getChannelId('balance', assetInfo.id)
    if (channels[channelId]) return
    yield put(channelActions.create({ channelId }))

    const channel = yield call(createBalanceChannel, assetInfo)

    const { unsubscribe } = yield race(({
      task: call(listenChannel, channel),
      unsubscribe: call(unsubscribeBalance, channelId)
    }))

    if (unsubscribe) {
      channel.close()
      yield put(channelActions.close(channelId))
    }
  } catch (error) {
    console.error(error.message)
  }
}

function* getRBTCLockBalance() {
  try {
    const api = yield call(fetchPolkaApi)
    const activeWallet = yield select(activeWalletSelector)
    const rbtcAssetId = yield select(rbtcAssetIdSelector)
    assert(rbtcAssetId, 'no rbtc asset')
    const assetInfo = getAssetUniqueInfo(activeWallet, { symbol: 'RBTC', assetId: rbtcAssetId })
    const { address } = activeWallet
    const result = yield call(api.query.rioSaving.shareUnreleasedList, address)
    const lockBalance = handleRBTCLockBalanceResponse(result)
    yield put(actions.updateBalance({ ...assetInfo, lockBalance }))
    yield put(actions.getRBTCLockBalance.succeeded())
  } catch (error) {
    yield put(actions.getRBTCLockBalance.failed(error.message))
  }
}

export default function* balanceSaga() {
  yield takeEvery(actions.subscribeBalance, subscribeBalance)
  yield takeEvery(actions.getRBTCLockBalance.requested, getRBTCLockBalance)
}
