import React, { Component } from 'react'
import { bindActionCreators } from 'redux-helper'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { NormalField } from 'components/FieldTemplate'
import { FormContainer } from 'components/Form'
import { contactSelector, activeContactSelector } from 'selectors/contact'
import { Form, Button, Select, message } from 'antd'
import * as actions from 'actions/contact'
import uuidv4 from 'uuid/v4'

const { Option } = Select

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

const validate = (values) => {
  const errors = {}

  if (!values.name) {
    errors.name = 'name is required'
  }

  if (!values.address) {
    errors.address = 'address is required'
  }

  return errors
}

@injectIntl

@reduxForm({ form: 'contactForm', validate })

@connect(
  state => ({
    contact: contactSelector(state),
    activeContact: activeContactSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch)
  })
)

export default class ContactForm extends Component {
  state = {
    chain: 'BTC'
  }

  submit = (data) => {
    const { contact, onClose, activeContact } = this.props
    const addresses = contact.map(item => item.address)

    const chain = this.state.chain
    const address = data.address
    const name = data.name
    const id = (activeContact && activeContact.id) || uuidv4()

    if (addresses.indexOf(address) !== -1) {
      message.error('address already exist!')
    } else {
      this.props.actions.addContact({ id, name, address, chain })
      if (onClose) onClose()
    }
  }

  handleChange = (chain) => {
    this.setState({ chain })
  }

  componentDidMount() {
    const { activeContact, change } = this.props

    if (activeContact) {
      const { chain, name, address } = activeContact
      change('name', name)
      change('address', address)
      this.setState({ chain }) // eslint-disable-line
    }
  }

  render() {
    const { invalid, pristine, handleSubmit, intl } = this.props
    const disabled = invalid || pristine

    return (
      <FormContainer>
        <form onSubmit={handleSubmit(this.submit)}>
          <Field
            name="name"
            type="text"
            component={NormalField}
            label={intl.formatMessage({ id: 'Name' })}
          />
          <Form.Item
            {...formItemLayout}
            label={intl.formatMessage({ id: 'Chain' })}
          >
            <Select defaultValue={this.state.chain} style={{ width: '100%' }} onChange={this.handleChange}>
              <Option value="BTC">BTC</Option>
              <Option value="RIO">RIO</Option>
            </Select>
          </Form.Item>
          <Field
            name="address"
            type="text"
            component={NormalField}
            label={intl.formatMessage({ id: 'Address' })}
          />
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" disabled={disabled}>{intl.formatMessage({ id: 'Add' })}</Button>
          </Form.Item>
        </form>
      </FormContainer>
    )
  }
}
