import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware, { END } from 'redux-saga'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { routerMiddleware as createRouterMiddleware } from 'connected-react-router'
import createRootReducer from 'reducers'

const persistConfig = {
  key: 'root',
  storage,
  timeout: null,
  whitelist: ['wallet', 'contact', 'intl', 'endPoint']
}

export default function configure(initialState, history) {
  const sagaMiddleware = createSagaMiddleware()
  const routerMiddleware = createRouterMiddleware(history)
  const middlewares = [routerMiddleware, sagaMiddleware]
  const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose
  const rootReducer = createRootReducer(history)
  const persistedReducer = persistReducer(persistConfig, rootReducer)
  const store = createStore(persistedReducer, initialState, composeEnhancers(applyMiddleware(...middlewares)))

  store.runSaga = sagaMiddleware.run
  store.close = () => store.dispatch(END)

  if (module.hot) {
    module.hot.accept('reducers', () => {
      const nextReducer = require('reducers').default
      store.replaceReducer(nextReducer)
    })
  }

  store.persistor = persistStore(store)

  return store
}
