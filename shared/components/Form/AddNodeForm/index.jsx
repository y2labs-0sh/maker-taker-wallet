import React, { Component } from 'react'
import { bindActionCreators } from 'redux-helper'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { NormalField } from 'components/FieldTemplate'
import { FormContainer } from 'components/Form'
import * as actions from 'actions/endPoint'
import { endPointsSelector } from 'selectors/endPoint'
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

const validate = (values) => {
  const errors = {}

  if (!values.name) {
    errors.name = 'name is required'
  } else if (values.name.length > 12) {
    errors.name = 'maximum 12 characters'
  }

  if (!values.url) {
    errors.url = 'address is required'
  } else if (!(values.url.indexOf('ws://') === 0 || values.url.indexOf('wss://') === 0)) {
    errors.url = 'invalid address'
  }

  return errors
}

@injectIntl

@reduxForm({ form: 'addNodeForm', validate })

@connect(
  state => ({
    locale: state.intl.locale,
    endPoints: endPointsSelector(state),
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch)
  })
)

export default class AddNodeForm extends Component {
  submit = (data) => {
    const { endPoints } = this.props
    const index = endPoints.findIndex(item => item.url === (data.url && data.url.trim()))
    if (index !== -1) {
      message.error('node exist!')
    } else {
      this.props.actions.addEndPoint({
        name: data.name && data.name.trim(),
        url: data.url && data.url.trim()
      })
      this.onSuccess()
    }
  }

  onSuccess = () => {
    this.props.reset()
    message.success('add succeeded!')
    if (this.props.onClose) this.props.onClose()
    this.props.actions.getEndPointStatus.requested()
  }

  onError = (error) => {
    message.error(error)
  }

  render() {
    const { invalid, pristine, handleSubmit, intl } = this.props
    const disabled = invalid || pristine

    return (
      <FormContainer center>
        <form onSubmit={handleSubmit(this.submit)}>
          <Field
            name="name"
            type="text"
            component={NormalField}
            label={intl.formatMessage({ id: 'Name' })}
          />
          <Field
            name="url"
            type="text"
            component={NormalField}
            label={intl.formatMessage({ id: 'Node Address' })}
          />
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" disabled={disabled}>{intl.formatMessage({ id: 'Add' })}</Button>
          </Form.Item>
        </form>
      </FormContainer>
    )
  }
}
