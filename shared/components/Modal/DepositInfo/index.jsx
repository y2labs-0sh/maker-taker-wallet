import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'redux-helper'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { activeWalletSelector, activeWalletBTCDepositAddressSelector } from 'selectors/wallet'
import { activeAssetBalanceSelector } from 'selectors/balance'
import QRCode from 'qrcode.react'
import { toShortAddress } from 'utils'
import { Icon, message, Button } from 'antd'
import copy from 'copy-to-clipboard'
import * as actions from 'actions/wallet'
import style from './style.css'

@injectIntl

@connect(
  state => ({
    wallet: activeWalletSelector(state),
    balance: activeAssetBalanceSelector(state),
    btcDepositAddress: activeWalletBTCDepositAddressSelector(state),
    getBitcoinDepositAddress: state.asyncRoutine.getBitcoinDepositAddress || {}
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch)
  })
)

export default class DepositInfo extends Component {
  copy = (text) => {
    copy(text)
    message.success('address copied')
  }

  retry = () => {
    this.props.actions.getBitcoinDepositAddress.requested()
  }

  render() {
    const { btcDepositAddress, wallet, balance, getBitcoinDepositAddress, intl } = this.props
    const isBTC = (balance && balance.symbol === 'BTC')
    const address = !isBTC ? wallet.address : btcDepositAddress
    const requesting = getBitcoinDepositAddress.requesting && !address
    const hasError = getBitcoinDepositAddress.error && !address

    return (
      <div className={style.depositInfo}>
        {(isBTC && requesting) && <div>{intl.formatMessage({ id: 'fetching btc deposit address...' })}</div>}
        {(isBTC && hasError) && <div>
          {intl.formatMessage({ id: 'fetching btc deposit address failed!' })}
          <Button onClick={this.retry} type="primary" style={{ marginLeft: '10px' }}>{intl.formatMessage({ id: 'Retry' })}<Icon type="redo" /></Button>
        </div>}
        {address && (
          <Fragment>
            <QRCode value={address} size={160} />
            <a className={style.address} onClick={this.copy.bind(this, address)}>
              {toShortAddress(address)}
              <Icon type="copy" style={{ marginLeft: '4px' }} />
            </a>
            <div>
              <div>{intl.formatMessage({ id: '* Send only {symbol} to this deposit address' }, { symbol: balance && balance.symbol })}</div>
              <div>
                {intl.formatMessage({ id: '* Receiving requires {count} confirmation, please be patient' }, { count: 6 })}
              </div>
              {isBTC && <div>
                {intl.formatMessage({ id: `* If your deposit amount is over 30 BTC, please contact support@riodefi.com, otherwise it won't be confirmed (will be in Pending until you cancel it)` }, { count: 6 })} {/* eslint-disable-line */}
              </div>}
            </div>
          </Fragment>
        )}
      </div>
    )
  }
}
