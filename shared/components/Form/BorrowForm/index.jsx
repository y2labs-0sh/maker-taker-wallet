import React, { Component } from 'react'
import { bindActionCreators } from 'redux-helper'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { NormalField } from 'components/FieldTemplate'
import { FormContainer } from 'components/Form'
import { rioBalanceSelector, sbtcBalanceSelector } from 'selectors/balance'
import { activeWalletSelector } from 'selectors/wallet'
import { activeLoanPackageSelector, btcPriceSelector } from 'selectors/loan'
import * as actions from 'actions/loan'
import { Form, Button, message } from 'antd'

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

  if (!values.amount) {
    errors.amount = 'amount is required'
  }

  return errors
}

@injectIntl

@reduxForm({ form: 'borrowForm', validate })

@connect(
  state => ({
    wallet: activeWalletSelector(state),
    borrow: state.asyncRoutine.borrow || {},
    rioBalance: rioBalanceSelector(state),
    sbtcBalance: sbtcBalanceSelector(state),
    activeLoanPackage: activeLoanPackageSelector(state),
    btcPrice: btcPriceSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch)
  })
)

export default class BorrowForm extends Component {
  submit = async (data) => {
    const { activeLoanPackage } = this.props

    this.props.actions.borrow.requested({
      amount: data.amount,
      loanId: activeLoanPackage.id,
      onSuccess: this.onSuccess,
      onError: this.onError
    })
  }

  onSuccess = () => {
    this.props.reset()
    message.success('borrow request sent!')
    if (this.props.onClose) this.props.onClose()
  }

  onError = (error) => {
    message.error(error)
  }

  render() {
    const { invalid, pristine, handleSubmit, intl, borrow, activeLoanPackage, btcPrice } = this.props

    const loading = borrow.requesting && !pristine
    const disabled = invalid || loading || pristine
    const loanAmount = activeLoanPackage.loan_balance_total
    const colateralAmount = activeLoanPackage.collateral_balance_available
    const available = (colateralAmount * btcPrice) - loanAmount

    return (
      <FormContainer center>
        <form onSubmit={handleSubmit(this.submit)}>
          <Form.Item
            {...formItemLayout}
            label={intl.formatMessage({ id: 'Asset' })}
          >
            <span className="ant-form-text">RIO</span>
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label={intl.formatMessage({ id: 'Available' })}
          >
            <span className="ant-form-text">{isNaN(available) ? available : intl.formatNumber(available, { minimumFractionDigits: 0, maximumFractionDigits: 8 })}</span>
          </Form.Item>
          <Field
            name="amount"
            type="text"
            component={NormalField}
            label={intl.formatMessage({ id: 'Amount' })}
            center={true}
          />
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" disabled={disabled} loading={loading}>{intl.formatMessage({ id: 'Apply' })}</Button>
          </Form.Item>
        </form>
      </FormContainer>
    )
  }
}
