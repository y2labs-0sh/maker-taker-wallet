import React, { Component } from 'react'
import { bindActionCreators } from 'redux-helper'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { FormContainer } from 'components/Form'
import { NormalField } from 'components/FieldTemplate'
import { activeAssetBalanceSelector } from 'selectors/balance'
import { activeWalletSelector } from 'selectors/wallet'
import * as actions from 'actions/transaction'
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
    },
  },
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
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

@reduxForm({ form: 'tradeAssetForm', validate })

@connect(
  state => ({
    wallet: activeWalletSelector(state),
    balance: activeAssetBalanceSelector(state),
    transferAsset: state.asyncRoutine.transferAsset || {}
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch)
  })
)

export default class TradeAssetForm extends Component {
  submit = async (data) => {
    this.props.actions.transferAsset.requested({
      amount: data.amount,
      receiver: data.receiver,
      assetId: this.props.balance.contract,
      onSuccess: this.onSuccess,
      onError: this.onError
    })
  }

  onSuccess = () => {
    this.props.reset()
    message.success('transaction sent!')
  }

  onError = (error) => {
    message.error(error)
  }

  handleModeChange = (e) => {
    console.log(e)
  }

  render() {
    const { invalid, pristine, handleSubmit, balance, wallet, intl, transferAsset } = this.props

    const loading = transferAsset.requesting && !pristine
    const disabled = invalid || pristine || loading

    const symbol = balance ? balance.symbol : '--'
    const available = balance ? balance.freeBalance : '--'
    const address = wallet ? wallet.address : '--'

    return (
      <FormContainer center>
        <form onSubmit={handleSubmit(this.submit)}>
          <Form.Item
            {...formItemLayout}
            label={intl.formatMessage({ id: 'Asset' })}
          >
            <span className="ant-form-text">{symbol}</span>
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label={intl.formatMessage({ id: 'Available' })}
          >
            <span className="ant-form-text">{isNaN(available) ? available : intl.formatNumber(available, { minimumFractionDigits: 8, maximumFractionDigits: 8 })}</span>
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label={intl.formatMessage({ id: 'Sender' })}
          >
            <span className="ant-form-text">{toShortAddress(address)}</span>
          </Form.Item>
          <Field
            name="receiver"
            type="text"
            component={NormalField}
            label={intl.formatMessage({ id: 'Receiver' })}
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
          <Form.Item
            {...formItemLayout}
            label={intl.formatMessage({ id: 'Fee' })}
          >
            <span className="ant-form-text">0.1 DFX</span>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" disabled={disabled} loading={loading}>{intl.formatMessage({ id: 'transfer' })}</Button>
          </Form.Item>
        </form>
      </FormContainer>
    )
  }
}
