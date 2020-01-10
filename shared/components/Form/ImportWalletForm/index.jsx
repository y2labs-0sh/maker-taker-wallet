import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'redux-helper'
import { injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { FormContainer } from 'components/Form'
import { NormalField, PasswordField, UploadField } from 'components/FieldTemplate'
import { Form, Button, message, Radio } from 'antd'
import { importWalletBySuri, importWalletByKeystore } from 'actions/wallet'

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 14,
      offset: 6,
    }
  }
}

const validate = (values) => {
  const errors = {}

  if (!values.mnemonics) {
    errors.mnemonics = 'Mnemonics is required'
  }

  if (!values.keystore) {
    errors.keystore = 'Keystore is required'
  }

  if (!values.name) {
    errors.name = 'Name is required'
  }

  if (!values.password) {
    errors.password = 'Password is required'
  }

  if (!values.confirmedPassword) {
    errors.confirmedPassword = 'Please confirm password'
  } else if (values.confirmedPassword !== values.password) {
    errors.confirmedPassword = 'Password don\'t match'
  }

  return errors
}

@injectIntl

@reduxForm({ form: 'importWalletForm', validate })

@connect(
  state => ({
    locale: state.intl.locale,
    importWalletBySuri: state.asyncRoutine.importWalletBySuri || {},
    importWalletByKeystore: state.asyncRoutine.importWalletByKeystore || {}
  }),
  dispatch => ({
    actions: bindActionCreators({
      importWalletBySuri,
      importWalletByKeystore
    }, dispatch)
  })
)

export default class ImportWalletForm extends Component {
  state = {
    mode: 'suri',
    fileList: []
  }

  handleModeChange = (e) => {
    this.props.reset()
    this.setState({ mode: e.target.value, fileList: [] })
  }

  beforeUpload = (file) => {
    this.setState({ fileList: [file] })

    return false
  }

  onRemove = () => {
    this.setState({ fileList: [] })
  }

  submit = (data) => {
    if (this.state.mode === 'suri') {
      this.props.actions.importWalletBySuri.requested({
        mnemonics: data.mnemonics,
        name: data.name,
        password: data.password,
        passwordHint: data.passwordHint,
        onSuccess: this.onSuccess,
        onError: this.onError
      })
    } else if (this.state.mode === 'keystore') {
      this.props.actions.importWalletByKeystore.requested({
        file: this.state.fileList[0],
        password: data.password,
        passwordHint: data.passwordHint,
        onSuccess: this.onSuccess,
        onError: this.onError
      })
    }
  }

  onSuccess = () => {
    this.props.reset()
    message.success('wallet imported!')
    if (this.props.toggleImport) this.props.toggleImport()
  }

  onError = (error) => {
    message.error(error)
  }

  render() {
    const { invalid, pristine, handleSubmit, importWalletBySuri, importWalletByKeystore, intl } = this.props
    const loading = (importWalletBySuri.requesting || importWalletByKeystore.requesting) && !pristine
    const disabled = invalid || loading || pristine || (this.state.mode === 'keystore' && !this.state.fileList.length)

    return (
      <FormContainer center>
        <form onSubmit={handleSubmit(this.submit)}>
          <Radio.Group
            onChange={this.handleModeChange}
            value={this.state.mode}
            style={{ marginBottom: 28, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Radio.Button value="suri">{intl.formatMessage({ id: 'Mnemonics' })}</Radio.Button>
            <Radio.Button value="keystore">{intl.formatMessage({ id: 'Keystore' })}</Radio.Button>
          </Radio.Group>
          <Fragment>
            {this.state.mode === 'suri' && (
              <Field
                name="mnemonics"
                type="text"
                component={NormalField}
                label={intl.formatMessage({ id: 'Mnemonics' })}
                placeholder={intl.formatMessage({ id: 'Input your Mnemonics in correct order to below table, use space to seperate Mnemonics' })}
                center={true}
                isTextArea
              />
            )}
            {this.state.mode === 'keystore' && (
              <Field
                name="keystore"
                type="file"
                component={UploadField}
                label={intl.formatMessage({ id: 'Keystore' })}
                placeholder={intl.formatMessage({ id: 'click to select or drag and drop the file here' })}
                center={true}
                beforeUpload={this.beforeUpload}
                fileList={this.state.fileList}
                onRemove={this.onRemove}
              />
            )}
            {this.state.mode === 'suri' && (
              <Field
                name="name"
                type="text"
                component={NormalField}
                label={intl.formatMessage({ id: 'Account Name' })}
                placeholder="1-12"
                center={true}
              />
            )}
            <Field
              name="password"
              type="password"
              component={PasswordField}
              label={intl.formatMessage({ id: 'Password' })}
              placeholder={intl.formatMessage({ id: 'Password' })}
              center={true}
            />
            {this.state.mode === 'suri' && (
              <Field
                name="confirmedPassword"
                type="password"
                component={PasswordField}
                label={intl.formatMessage({ id: 'Confirm' })}
                placeholder={intl.formatMessage({ id: 'Password' })}
                center={true}
              />
            )}
            <Field
              name="passwordHint"
              type="text"
              component={NormalField}
              label={intl.formatMessage({ id: 'Password Hint' })}
              placeholder={intl.formatMessage({ id: 'Optional' })}
              center={true}
            />
          </Fragment>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" disabled={disabled} loading={loading}>{intl.formatMessage({ id: 'Import' })}</Button>
          </Form.Item>
        </form>
      </FormContainer>
    )
  }
}
