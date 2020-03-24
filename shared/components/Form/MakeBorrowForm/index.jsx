import React, { Component } from 'react'
import { bindActionCreators } from 'redux-helper'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { activeAssetBalanceSelector } from 'selectors/balance'
import * as actions from 'actions/market'
import { Form, Button, message, Input } from 'antd'

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

@injectIntl

@connect(
  state => ({
    balance: activeAssetBalanceSelector(state),
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch)
  })
)

export default class MakeBorrowForm extends Component {
  submit = async () => {
    this.props.actions.makeBorrow.requested({
      collateral_balance: this.state.collateral_balance,
      trading_pair: {
        collateral: this.state.collateral,
        borrow: this.state.borrow,
      },
      borrow_options: {
        amount: this.state.amount,
        terms: this.state.terms,
        interest_rate: this.state.interest_rate,
      },
      onSuccess: this.onSuccess,
      onError: this.onError
    })
  }

  state = {
    collateral_balance: '',
    collateral: '',
    borrow: '',
    amount: '',
    terms: '',
    interest_rate: ''
  }

  inputChange(event) {
    const name = event.target.name
    this.setState({
      [name]: event.target.value
    })
  }

  onSuccess = () => {
    this.props.reset()
    message.success('success added!')
  }

  onError = (error) => {
    message.error(error)
  }

  handleModeChange = (e) => {
    console.log(e)
  }

  render() {
    const { balance, intl } = this.props

    const symbol = balance ? balance.symbol : '--'

    return (
      <form>
        <Form.Item
          {...formItemLayout}
          label={intl.formatMessage({ id: 'balance' })}
        >
          <span className="ant-form-text">{symbol}</span>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label={intl.formatMessage({ id: 'collateralBalance' })}
        >
          <Input value={this.state.collateral_balance} name="collateral_balance" onChange={this.inputChange.bind(this)} />
        </Form.Item>
        <a-divider />
        <Form.Item
          {...formItemLayout}
          label={intl.formatMessage({ id: 'collateral' })}
        >
          <Input value={this.state.collateral} name="collateral" onChange={this.inputChange.bind(this)} />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label={intl.formatMessage({ id: 'borrow' })}
        >
          <Input value={this.state.borrow} name="borrow" onChange={this.inputChange.bind(this)} />
        </Form.Item>
        <a-divider />
        <Form.Item
          {...formItemLayout}
          label={intl.formatMessage({ id: 'amount' })}
        >
          <Input value={this.state.amount} name="amount" onChange={this.inputChange.bind(this)} />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label={intl.formatMessage({ id: 'terms' })}
        >
          <Input value={this.state.terms} name="terms" onChange={this.inputChange.bind(this)} />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label={intl.formatMessage({ id: 'interest_rate' })}
        >
          <Input value={this.state.interest_rate} name="interest_rate" onChange={this.inputChange.bind(this)} />
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" onClick={this.submit.bind(this)} >{intl.formatMessage({ id: 'make' })}</Button>
        </Form.Item>
      </form>
    )
  }
}
