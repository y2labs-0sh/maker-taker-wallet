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

export default class AddBorrowForm extends Component {
  submit = async () => {
    this.setState({
      loading: true
    })
    this.props.actions.addBorrow.requested({
      borrowId: this.props.item.id,
      amount: this.state.collateralAmount,
      onSuccess: this.onSuccess,
      onError: this.onError
    })
  }

  state = {
    collateralAmount: '',
    loading: '',
  }

  collateralChange(event) {
    this.setState({
      collateralAmount: event.target.value
    })
  }

  onSuccess = () => {
    this.setState({
      loading: false
    })
    this.props.reset()
    message.success('success added!')
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
          <span className="ant-form-text">{item.collateralBalance} {symbolsMapping[item.collateral_asset_id]}</span>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label={intl.formatMessage({ id: 'addCollateral' })}
        >
          <Input value={this.state.collateralAmount} onChange={this.collateralChange.bind(this)} />
        </Form.Item>
        {/* <Field
            name="amount"
            type="text"
            component={NormalField}
            label={intl.formatMessage({ id: 'Add Collateral' })}
            center={true}
          /> */}
        <Form.Item {...tailFormItemLayout}>
          <Button loading={loading} type="primary" onClick={this.submit.bind(this)} >{intl.formatMessage({ id: 'add' })}</Button>
        </Form.Item>
      </form>
    )
  }
}
