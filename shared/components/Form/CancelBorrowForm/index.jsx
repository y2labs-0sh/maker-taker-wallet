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

export default class CancelBorrowForm extends Component {
  submit = async () => {
    this.props.actions.cancelBorrow.requested({
      borrowId: this.props.item.id,
      onSuccess: this.onSuccess,
      onError: this.onError
    })
  }

  onSuccess = () => {
    this.props.reset()
    message.success('success canceled!')
  }

  onError = (error) => {
    message.error(error)
  }

  handleModeChange = (e) => {
    console.log(e)
  }

  render() {
    const { intl, item } = this.props

    return (
      <form>
        <Form.Item
          {...formItemLayout}
          label={intl.formatMessage({ id: 'cancel' })}
        >
          <span className="ant-form-text">Are you sure to cancel borrow_id {item.id}</span>
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" onClick={this.submit.bind(this)} >{intl.formatMessage({ id: 'cancel' })}</Button>
        </Form.Item>
      </form>
    )
  }
}
