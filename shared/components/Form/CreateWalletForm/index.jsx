import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'redux-helper'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { FormContainer } from 'components/Form'
import { NormalField, PasswordField } from 'components/FieldTemplate'
import Spinner from 'components/Spinner'
import { Form, Button, Steps, message } from 'antd'
import classNames from 'classnames'
import { importWalletBySuri } from 'actions/wallet'
import * as bip39 from 'bip39'

import style from './style.css'

function shuffle(a) {
  const array = [...a]
  let counter = array.length

  while (counter > 0) {
    const index = Math.floor(Math.random() * counter)
    counter--;
    const temp = array[counter]
    array[counter] = array[index]
    array[index] = temp
  }

  return array
}

const Step = Steps.Step

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

@reduxForm({ form: 'createWalletForm', validate })

@connect(
  state => ({
    locale: state.intl.locale,
    importWalletBySuri: state.asyncRoutine.importWalletBySuri || {}
  }),
  dispatch => ({
    actions: bindActionCreators({
      importWalletBySuri
    }, dispatch)
  })
)

export default class CreateWalletForm extends Component {
  state = {
    step: 0,
    mnemonic: '',
    shuffledMnemonic: '',
    userMnemonic: ''
  }

  submit = (data) => {
    if (!this.state.step) {
      const mnemonic = bip39.generateMnemonic()
      this.setState({ mnemonic })
    } else if (this.state.step === 1) {
      const shuffledMnemonic = shuffle(this.state.mnemonic.split(' ')).join(' ')
      this.setState({ shuffledMnemonic })
    }

    if (this.state.step < 2) {
      this.setState({ step: this.state.step + 1 })
    } else if (this.state.step === 2) {
      if (this.state.mnemonic !== this.state.userMnemonic) {
        message.error('The order of mnemonics is not correct!')
      } else {
        this.props.actions.importWalletBySuri.requested({
          mnemonics: this.state.mnemonic,
          name: data.name,
          password: data.password,
          passwordHint: data.passwordHint,
          onSuccess: this.onSuccess,
          onError: this.onError
        })
      }
    }
  }

  onSuccess = () => {
    this.props.reset()
    message.success('wallet created!')
    if (this.props.toggleCreate) this.props.toggleCreate()
  }

  onError = (error) => {
    message.error(error)
  }

  userMnemonicClick = (i) => {
    const userMnemonic = [...this.state.userMnemonic.split(' ')]
    const word = userMnemonic.splice(i, 1)
    this.setState({
      userMnemonic: userMnemonic.join(' ').trim(),
      shuffledMnemonic: [...this.state.shuffledMnemonic.split(' '), ...word].join(' ').trim()
    })
  }

  shuffledMnemonicClick = (i) => {
    const shuffledMnemonic = [...this.state.shuffledMnemonic.split(' ')]
    const word = shuffledMnemonic.splice(i, 1)
    this.setState({
      shuffledMnemonic: shuffledMnemonic.join(' ').trim(),
      userMnemonic: [...this.state.userMnemonic.split(' '), ...word].join(' ').trim()
    })
  }

  render() {
    const { invalid, pristine, handleSubmit, importWalletBySuri, intl } = this.props
    const loading = importWalletBySuri.requesting && !pristine
    const disabled = invalid || loading || pristine

    return (
      <FormContainer center>
        <Steps size="small" current={this.state.step} style={{ marginBottom: '30px' }}>
          <Step title={intl.formatMessage({ id: 'Create' })} />
          <Step title={intl.formatMessage({ id: 'Backup' })} />
          <Step title={intl.formatMessage({ id: 'Verify' })} />
        </Steps>
        <form onSubmit={handleSubmit(this.submit)}>
          {this.state.step === 0 && <Fragment>
            <Field
              name="name"
              type="text"
              component={NormalField}
              label={intl.formatMessage({ id: 'Account Name' })}
              placeholder="1-12"
              center={true}
            />
            <Field
              name="password"
              type="password"
              component={PasswordField}
              label={intl.formatMessage({ id: 'Password' })}
              placeholder={intl.formatMessage({ id: 'Password' })}
              center={true}
            />
            <Field
              name="confirmedPassword"
              type="password"
              component={PasswordField}
              label={intl.formatMessage({ id: 'Confirm' })}
              placeholder={intl.formatMessage({ id: 'Password' })}
              center={true}
            />
            <Field
              name="passwordHint"
              type="text"
              component={NormalField}
              label={intl.formatMessage({ id: 'Password Hint' })}
              placeholder={intl.formatMessage({ id: 'Optional' })}
              center={true}
            />
          </Fragment>}
          {this.state.step === 1 && <div>
            <div style={{ marginBottom: '10px' }}>
              {intl.formatMessage({ id: 'Please well backup your Mnemonic, and keep it in a secure and safe place, once the Mnemonic get lost, it cannot be retrieved!!' })}
            </div>
            <div className={style.mnemonicButtons}>
              {this.state.mnemonic.split(' ').map((word, i) =>
                <Button key={`${word}_${i}`} className={style.mnemonicButton}>{word}</Button>
              )}
            </div>
          </div>}
          {this.state.step === 2 && <div>
            <div className={classNames(style.mnemonicButtons, { [style.empty]: !this.state.userMnemonic.length })}>
              {!this.state.userMnemonic.length && <div>Select your Mnemonic in order</div>}
              {!!this.state.userMnemonic.length && this.state.userMnemonic.split(' ').map((word, i) =>
                <Button key={`${word}_${i}`} className={style.mnemonicButton} onClick={this.userMnemonicClick.bind(this, i)}>{word}</Button>
              )}
            </div>
            <div className={classNames(style.mnemonicButtons, { [style.empty]: !this.state.shuffledMnemonic.length })}>
              {!this.state.shuffledMnemonic.length && <div>Verify your Mnemonic</div>}
              {!!this.state.shuffledMnemonic.length && this.state.shuffledMnemonic.split(' ').map((word, i) =>
                <Button key={`${word}_${i}`} className={style.mnemonicButton} onClick={this.shuffledMnemonicClick.bind(this, i)}>{word}</Button>
              )}
            </div>
          </div>}
          {this.state.step === 0 && <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" disabled={disabled}>{loading ? <Spinner /> : intl.formatMessage({ id: 'Next' })}</Button>
          </Form.Item>}
          {this.state.step === 1 && <Form.Item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button type="primary" htmlType="submit" disabled={disabled}>{intl.formatMessage({ id: 'I have backed up' })}</Button>
          </Form.Item>}
          {this.state.step === 2 && <Form.Item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button type="primary" htmlType="submit" disabled={disabled} loading={loading}>{intl.formatMessage({ id: 'Verify' })}</Button>
          </Form.Item>}
        </form>
      </FormContainer>
    )
  }
}
