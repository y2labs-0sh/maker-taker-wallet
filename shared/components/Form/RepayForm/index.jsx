import React, { Component } from 'react'
import { bindActionCreators } from 'redux-helper'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { reduxForm } from 'redux-form'
import { FormContainer } from 'components/Form'
import { rioBalanceSelector } from 'selectors/balance'
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

const validate = () => {
  const errors = {}

  return errors
}

@injectIntl

@reduxForm({ form: 'replayForm', validate })

@connect(
  state => ({
    wallet: activeWalletSelector(state),
    repay: state.asyncRoutine.repay || {},
    rioBalance: rioBalanceSelector(state),
    activeLoanPackage: activeLoanPackageSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch)
  })
)

export default class ReplayForm extends Component {
  submit = async () => {
    const { activeLoanPackage } = this.props
    this.props.actions.repay.requested({
      loanId: activeLoanPackage.id,
      onSuccess: this.onSuccess,
      onError: this.onError
    })
  }

  onSuccess = () => {
    this.props.reset()
    message.success('repay request sent!')
    if (this.props.onClose) this.props.onClose()
  }

  onError = (error) => {
    message.error(error)
  }

  render() {
    const { handleSubmit, intl, repay, rioBalance, activeLoanPackage } = this.props

    const loading = repay.requesting
    const loanBalanceTotal = activeLoanPackage ? activeLoanPackage.loan_balance_total : '--'

    const available = rioBalance ? rioBalance.freeBalance : '--'

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
          <Form.Item
            {...formItemLayout}
            label={intl.formatMessage({ id: 'Amount' })}
          >
            <span className="ant-form-text">{isNaN(loanBalanceTotal) ? loanBalanceTotal : intl.formatNumber(loanBalanceTotal, { minimumFractionDigits: 0, maximumFractionDigits: 8 })}</span>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" disabled={loading} loading={loading}>{intl.formatMessage({ id: 'replay' })}</Button>
          </Form.Item>
        </form>
      </FormContainer>
    )
  }
}
