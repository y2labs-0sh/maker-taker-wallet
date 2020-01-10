import React, { Component } from 'react'
import { bindActionCreators } from 'redux-helper'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { PasswordField } from 'components/FieldTemplate'
import { Form, Modal } from 'antd'
import * as actions from 'actions/password'

const validate = (values) => {
  const errors = {}

  if (!values.password) {
    errors.password = 'Password is required'
  }

  return errors
}

@injectIntl

@reduxForm({ form: 'passwordForm', validate })

@connect(
  state => ({
    requesting: state.password.requesting
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch)
  })
)

export default class PasswordPrompt extends Component {
  submit = (data) => {
    this.props.actions.submitPassword(data)
    this.props.reset()
  }

  onCancel = () => {
    this.props.actions.cancelPassword()
    this.props.reset()
  }

  render() {
    const { handleSubmit, invalid, pristine, requesting, intl } = this.props
    const disabled = invalid || pristine

    return (
      <Modal
        title={intl.formatMessage({ id: 'Please input wallet password' })}
        visible={requesting}
        closable
        onCancel={this.onCancel}
        onOk={handleSubmit(this.submit)}
        okButtonProps={{ disabled }}
        okText="Confirm"
        width={400}
        zIndex={2000}
      >
        <Form layout="vertical">
          <Field
            name="password"
            type="password"
            component={PasswordField}
            placeholder={intl.formatMessage({ id: 'password' })}
            style={{ marginBottom: 0, paddingBottom: 0 }}
            strench={true}
          />
        </Form>
      </Modal>
    )
  }
}
