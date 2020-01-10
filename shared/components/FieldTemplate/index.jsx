import React from 'react'
import { Form, Input, Upload } from 'antd'

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

const Dragger = Upload.Dragger

export const NormalField = ({ input, label, type, placeholder, meta: { touched, error }, isTextArea, style, disabled, addonAfter }) => (
  <Form.Item
    label={label}
    {...formItemLayout}
    hasFeedback={!!(touched && error)}
    validateStatus={(touched && error) ? 'error' : null}
    help={touched && error}
    style={style || {}}
  >
    {isTextArea ? <Input.TextArea autoComplete="off" rows={3} {...input} type={type} placeholder={placeholder} disabled={disabled} /> : <Input autoComplete="off" {...input} type={type} placeholder={placeholder} disabled={disabled} addonAfter={addonAfter} />}
  </Form.Item>
)

export const UploadField = ({ input, label, type, placeholder, meta: { touched, error }, beforeUpload, fileList, onRemove }) => (
  <Form.Item
    label={label}
    {...formItemLayout}
    hasFeedback={!!(touched && error)}
    validateStatus={(touched && error) ? 'error' : null}
    help={touched && error}
  >
    <Dragger {...input} type={type} placeholder={placeholder} beforeUpload={beforeUpload} fileList={fileList} onRemove={onRemove}>
      <p className="ant-upload-hint" style={{ paddingLeft: '10px', paddingRight: '10px' }}>{placeholder}</p>
    </Dragger>
  </Form.Item>
)

export class PasswordField extends React.Component {
  state = {
    type: this.props.type
  }

  onShowPassword = () => {
    const type = this.state.type
    this.setState({
      type: type === 'text' ? 'password' : 'text'
    })
  }

  render () {
    const { input, label, placeholder, meta: { touched, error }, style, strench } = this.props
    const { type } = this.state
    const format = strench ? {} : formItemLayout

    return (
      <Form.Item
        label={label}
        {...format}
        hasFeedback={!!(touched && error)}
        validateStatus={(touched && error) ? 'error' : null}
        help={touched && error}
        style={style || {}}
      >
        <Input autoComplete="off" {...input} type={type} placeholder={placeholder} />
      </Form.Item>
    )
  }
}
