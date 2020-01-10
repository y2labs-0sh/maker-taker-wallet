import React, { Component } from 'react'
import { bindActionCreators } from 'redux-helper'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { FormContainer } from 'components/Form'
import { NormalField } from 'components/FieldTemplate'
import { injectIntl } from 'react-intl'
import { activeWalletSelector } from 'selectors/wallet'
import { sbtcBalanceSelector } from 'selectors/balance'
import * as actions from 'actions/wallet'
import { Form, Button, message } from 'antd'
import { toShortAddress } from 'utils'

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 14,
      offset: 6,
    }
  }
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  }
}

const validate = (values) => {
  const errors = {}

  if (!values.receiver) {
    errors.receiver = 'Receiver is required'
  }

  if (!values.amount) {
    errors.amount = 'Amount is required'
  }

  return errors
}

@injectIntl

@reduxForm({ form: 'withdrawAssetForm', validate })

@connect(
  state => ({
    withdrawBitcoin: state.asyncRoutine.withdrawBitcoin || {},
    wallet: activeWalletSelector(state),
    transferAsset: state.asyncRoutine.transferAsset,
    balance: sbtcBalanceSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch)
  })
)

export default class WithdrawAssetForm extends Component {
  submit = (data) => {
    const { wallet } = this.props;
    this.props.actions.withdrawBitcoin.requested({
      fromAddress: wallet.address,
      toAddress: data.receiver,
      asset: 'btc',
      amount: data.amount,
      onSuccess: this.onSuccess,
      onError: this.onError
    })
  }

  onSuccess = () => {
    this.props.reset()
    message.success('withdraw request sent!')
    if (this.props.onClose) this.props.onClose()
  }

  onError = (error) => {
    message.error(error)
  }

  render() {
    const { invalid, pristine, handleSubmit, wallet, withdrawBitcoin, balance, intl } = this.props
    const loading = withdrawBitcoin.requesting && !pristine
    const disabled = invalid || loading || pristine

    const symbol = 'BTC'
    const available = (balance && balance.freeBalance) ? intl.formatNumber(balance.freeBalance, { minimumFractionDigits: 8, maximumFractionDigits: 8 }) : '--'

    return (
      <FormContainer center>
        <form onSubmit={handleSubmit(this.submit)}>
          <Form.Item {...formItemLayout} label={intl.formatMessage({ id: 'Asset' })}>
            <span className="ant-form-text">{symbol}</span>
          </Form.Item>
          <Form.Item {...formItemLayout} label={intl.formatMessage({ id: 'Available' })}>
            <span className="ant-form-text">{available}</span>
          </Form.Item>
          <Form.Item {...formItemLayout} label={intl.formatMessage({ id: 'From' })}>
            <span className="ant-form-text">{toShortAddress(wallet.address)}</span>
          </Form.Item>
          <Field
            name="receiver"
            type="text"
            component={NormalField}
            label={intl.formatMessage({ id: 'To' })}
            placeholder=""
            center={true}
          />
          <Field
            name="amount"
            type="text"
            component={NormalField}
            label={intl.formatMessage({ id: 'Amount' })}
            center={true}
          />
          <Form.Item {...formItemLayout} label={intl.formatMessage({ id: 'Fee' })}>
            <span className="ant-form-text">0.001</span>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" disabled={disabled} loading={loading}>{intl.formatMessage({ id: 'withdraw' })}</Button>
          </Form.Item>
        </form>
      </FormContainer>
    )
  }
}
