import 'core-js/stable'
import React from 'react'
import ReactDOM from 'react-dom'
import { ConnectedRouter } from 'connected-react-router'
import { renderRoutes } from 'react-router-config'
import { PersistGate } from 'redux-persist/integration/react'
import { createBrowserHistory } from 'history'
import Provider from 'components/Provider'
import * as bundles from 'routes/async'
import { errorLoading } from 'utils'
import configure from 'store'
import routes from 'routes'
import sagas from 'sagas'

const isPreloaded = !!window.__PRELOADED_STATE__
const preloadedState = window.__PRELOADED_STATE__ || {}
const preloadedChunks = window.__PRELOADED_CHUNKS__ || []
const browserHistory = createBrowserHistory()
const store = configure(preloadedState, browserHistory)
store.runSaga(sagas)

const renderApp = (routes) => {
  (isPreloaded ? ReactDOM.hydrate : ReactDOM.render)(
    <Provider store={store}>
      <PersistGate loading={null} persistor={store.persistor}>
        <ConnectedRouter history={browserHistory}>
          {renderRoutes(routes)}
        </ConnectedRouter>
      </PersistGate>
    </Provider>,
    document.getElementById('root')
  )
}

async function runApp() {
  try {
    if (!window.Intl) {
      await import('intl'/* webpackChunkName: 'intl' */)
      await Promise.all([
        import('intl/locale-data/jsonp/en.js'/* webpackChunkName: 'en' */),
        import('intl/locale-data/jsonp/zh.js'/* webpackChunkName: 'zh' */)
      ])
      console.log('using intl polyfill')
    }

    if (preloadedChunks) {
      await Promise.all(preloadedChunks.map(
        chunk => bundles[chunk].loadComponent()
      ))
    }
  } catch (error) {
    errorLoading(error)
  }

  renderApp(routes)
}

if (module.hot) {
  module.hot.accept('routes', () => {
    const nextRoutes = require('routes').default
    renderApp(nextRoutes)
  })
}

runApp()
