import React, { Component } from 'react'
import { bindActionCreators } from 'redux-helper'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { Route, Switch } from 'react-router'
import 'normalize.css/normalize.css'
import 'antd/dist/antd.css'
import 'resources/fonts/fonts.css'
import Title from 'components/DocumentTitle'
import Header from 'components/Header'
import Footer from 'components/Footer'
import { Layout } from 'antd'
import * as walletActions from 'actions/wallet'
import * as stakeActions from 'actions/stake'
import * as socketActions from 'actions/socket'
import * as loanActions from 'actions/loan'
import * as chainActions from 'actions/chain'
import style from './style.css'

const renderRoutes = (routes, extraProps = {}, switchProps = {}) => (routes ? (
  <Switch {...switchProps}>
    {routes.map((route, i) => (
      <Route
        key={route.key || i}
        path={route.path}
        exact={route.exact}
        strict={route.strict}
        render={props => (<route.component {...props} {...extraProps} route={route} />)}
      />
    ))}
  </Switch>
) : null)

@injectIntl

@connect(
  state => ({
    locale: state.intl.locale
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions,
      ...stakeActions,
      ...socketActions,
      ...loanActions,
      ...chainActions
    }, dispatch)
  })
)

export default class Root extends Component {
  componentDidMount() {
    this.props.actions.scanWallets.requested()
    this.props.actions.connect()

    this.props.actions.getSBTCAssetId.requested()
    this.props.actions.getRBTCAssetId.requested()
    this.props.actions.getSavingAccountId.requested()
    this.props.actions.getCurrentPhaseId.requested()
    this.props.actions.getPhaseList.requested()
    this.props.actions.getUsedQuota.requested()
    this.props.actions.subscribeBTCPrice()
    this.props.actions.subscribeChainState()
  }

  render() {
    const { route, intl } = this.props

    return (
      <div className={style.app}>
        <Title render={intl.formatMessage({ id: 'Definex' })} />
        <Header />
        <Layout.Content>
          <div className={style.content}>
            {renderRoutes(route.routes)}
          </div>
        </Layout.Content>
        <Footer />
      </div>
    )
  }
}
