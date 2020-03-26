import React, { Component } from 'react'
import { bindActionCreators } from 'redux-helper'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { activeAssetBalanceSelector } from 'selectors/balance'
import * as actions from 'actions/market'
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

@injectIntl

@connect(
  state => ({
    balance: activeAssetBalanceSelector(state),
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch)
  })
)

export default class LendBorrowForm extends Component {
  submit = async () => {
    this.setState({
      loading: true
    })
    this.props.actions.lendBorrow.requested({
      borrowId: this.props.item.id,
      onSuccess: this.onSuccess,
      onError: this.onError
    })
  }

  state = {
    loading: '',
  }

  onSuccess = () => {
    this.setState({
      loading: false
    })
    this.props.reset()
    message.success('success!')
  }

  onError = (error) => {
    this.setState({
      loading: false
    })
    message.error(error)
  }

  handleModeChange = (e) => {
    console.log(e)
  }

  render() {
    const { balance, intl, item, symbolsMapping } = this.props
    const { loading } = this.state
    console.log(balance)
    // const symbol = balance ? balance.symbol : '--'

    return (
      <form>
        <Form.Item
          {...formItemLayout}
          label={intl.formatMessage({ id: 'balance' })}
        >
          <span className="ant-form-text">{item.borrowBalance} {symbolsMapping[item.borrow_asset_id]}</span>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label={intl.formatMessage({ id: 'return' })}
        >
          <span className="ant-form-text">{item.borrow_balance}</span>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label={intl.formatMessage({ id: 'interest' })}
        >
          <span className="ant-form-text">{item.interest_rate}</span>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label={intl.formatMessage({ id: 'fee' })}
        >
          <span className="ant-form-text">{item.borrow_balance * item.interest_rate}</span>
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button loading={loading} type="primary" onClick={this.submit.bind(this)} >{intl.formatMessage({ id: 'lend' })}</Button>
        </Form.Item>
      </form>
    )
  }
}
