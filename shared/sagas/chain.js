import { eventChannel } from 'redux-saga'
import { takeEvery, call, put, race, take, select } from 'redux-saga/effects'
import { listenChannel } from 'sagas/channel'
import { fetchPolkaApi } from 'sagas/socket'
import { channelSelector } from 'selectors/channel'
import * as channelActions from 'actions/channel'
import * as actions from 'actions/chain'

let lastBlockTime = null

function* createChainStateChannel() {
  const api = yield call(fetchPolkaApi)

  return eventChannel((emit) => {
    let unsubscribeAction

    api.rpc.chain.subscribeNewHeads((result) => {
      emit(actions.updateChainState({ blockHeight: Number(result.number) }))
      const currentBlockTime = +Date.now()
      if (lastBlockTime) {
        emit(actions.updateChainState({ blockTime: currentBlockTime - lastBlockTime }))
      }
      lastBlockTime = currentBlockTime
    }).then((cancel) => {
      unsubscribeAction = cancel
    })

    const unsubscribe = () => {
      if (unsubscribeAction) unsubscribeAction()
    }

    return unsubscribe
  })
}

function* subscribeChainState() {
  try {
    const channels = yield select(channelSelector)
    const channelId = 'chainState'
    if (channels[channelId]) return
    yield put(channelActions.create({ channelId }))

    const channel = yield call(createChainStateChannel)

    const { unsubscribe } = yield race(({
      task: call(listenChannel, channel),
      unsubscribe: take(actions.unsubscribeChainState)
    }))

    if (unsubscribe) {
      channel.close()
      yield put(channelActions.close(channelId))
    }
  } catch (error) {
    console.error(error.message)
  }
}

export default function* chainSaga() {
  yield takeEvery(actions.subscribeChainState, subscribeChainState)
}
