import React, { Component } from 'react'
import { bindActionCreators } from 'redux-helper'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { NormalField } from 'components/FieldTemplate'
import { FormContainer } from 'components/Form'
import { rioBalanceSelector, sbtcBalanceSelector } from 'selectors/balance'
import { activeWalletSelector } from 'selectors/wallet'
import { activeLoanPackageSelector } from 'selectors/loan'
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

@reduxForm({ form: 'addCollateralForm', validate })

@connect(
  state => ({
    wallet: activeWalletSelector(state),
    addCollateral: state.asyncRoutine.addCollateral || {},
    rioBalance: rioBalanceSelector(state),
    sbtcBalance: sbtcBalanceSelector(state),
    activeLoanPackage: activeLoanPackageSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch)
  })
)

export default class AddCollateralForm extends Component {
  submit = async (data) => {
    const { activeLoanPackage } = this.props

    this.props.actions.addCollateral.requested({
      amount: data.amount,
      loanId: activeLoanPackage.id,
      onSuccess: this.onSuccess,
      onError: this.onError
    })
  }

  onSuccess = () => {
    this.props.reset()
    message.success('add collateral request sent!')
    if (this.props.onClose) this.props.onClose()
  }

  onError = (error) => {
    message.error(error)
  }

  render() {
    const { invalid, pristine, handleSubmit, intl, addCollateral, sbtcBalance, activeLoanPackage } = this.props

    const loading = addCollateral.requesting && !pristine
    const disabled = invalid || loading || pristine
    const available = sbtcBalance ? sbtcBalance.freeBalance : '--'
    const currentLTV = activeLoanPackage ? activeLoanPackage.currentLTV : '--'

    return (
      <FormContainer center>
        <form onSubmit={handleSubmit(this.submit)}>
          <Form.Item
            {...formItemLayout}
            label={intl.formatMessage({ id: 'Asset' })}
          >
            <span className="ant-form-text">BTC</span>
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
          <Form.Item
            {...formItemLayout}
            label={intl.formatMessage({ id: 'Original LTV' })}
          >
            <span className="ant-form-text">65%</span>
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label={intl.formatMessage({ id: 'Current LTV' })}
          >
            <span className="ant-form-text">{isNaN(currentLTV) ? currentLTV : `${intl.formatNumber(currentLTV * 100, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}%`}</span>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" disabled={disabled} loading={loading}>{intl.formatMessage({ id: 'Add Collateral' })}</Button>
          </Form.Item>
        </form>
      </FormContainer>
    )
  }
}
