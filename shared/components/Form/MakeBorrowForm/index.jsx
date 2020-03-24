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
      trading_pair: this.state.trading_pair,
      collateral_balance: this.state.collateral_balance,
      borrow_options: {
        amount: this.state.amount,
        terms: this.state.terms,
        interest_rate: this.state.interest_rate * (10 ** 8),
      },
      onSuccess: this.onSuccess,
      onError: this.onError
    })
  }

  state = {
    trading_pair: '',
    collateralBalance: '',
    collateral_balance: '',
    amount: '',
    terms: '',
    interest_rate: ''
  }

  async componentDidMount() {
    this.initTradingPair()
  }

  async initTradingPair() {
    console.log('propppps', this.props)
    const api = this.props.api
    const symbols = await api.query.genericAsset.symbols()
    console.log('symbols', JSON.parse(symbols.toString()))
    const tradingPair = await api.query.lsBiding.tradingPairs()
    this.setState({
      //get first trading pair array
      trading_pair: JSON.parse(tradingPair.toString())[0]
    }, async () => {
      //fetch collateral balance
      const collateralBalance = await api.query.genericAsset.freeBalance(this.state.trading_pair.collateral, this.props.address)
      this.setState({
        collateralBalance: collateralBalance.toString()
      })
    })
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
    console.log(balance)
    // const symbol = balance ? balance.symbol : '--'
    return (
      <form>
        <Form.Item
          {...formItemLayout}
          label={intl.formatMessage({ id: 'balance' })}
        >
          <span className="ant-form-text">{this.state.collateralBalance}</span>
        </Form.Item>
        <a-divider />
        <Form.Item
          {...formItemLayout}
          label={intl.formatMessage({ id: 'collateral' })}
        >
          <span className="ant-form-text">{this.state.trading_pair.collateral}</span>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label={intl.formatMessage({ id: 'borrow' })}
        >
          <span className="ant-form-text">{this.state.trading_pair.borrow}</span>
        </Form.Item>
        <a-divider />
        <Form.Item
          {...formItemLayout}
          label={intl.formatMessage({ id: 'collateralBalance' })}
        >
          <Input value={this.state.collateral_balance} name="collateral_balance" onChange={this.inputChange.bind(this)} />
        </Form.Item>
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
          <Input value={this.state.terms} suffix="days" name="terms" onChange={this.inputChange.bind(this)} />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label={intl.formatMessage({ id: 'interest_rate' })}
        >
          <Input value={this.state.interest_rate} suffix="per day" name="interest_rate" onChange={this.inputChange.bind(this)} />
          {/* <span>{this.state.interest_rate * 365}% per year.</span> */}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" onClick={this.submit.bind(this)} >{intl.formatMessage({ id: 'make' })}</Button>
        </Form.Item>
      </form>
    )
  }
}
