import React, { Component } from 'react'
import { bindActionCreators } from 'redux-helper'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { injectIntl } from 'react-intl'
import { NormalField } from 'components/FieldTemplate'
import * as actions from 'actions/stake'
import { activeWalletSelector } from 'selectors/wallet'
import { sbtcBalanceSelector } from 'selectors/balance'
import { Row, Col, Card, Form, Button, message } from 'antd'
import style from './style.css'

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

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  }
}

const validate = () => {
  const errors = {}

  /* if (!values.receiver) {
   *   errors.stakeAmount = 'btc amount is required'
   * } */

  return errors
}

@injectIntl

@reduxForm({ form: 'stakeForm', validate })

@connect(
  state => ({
    stakeBTC: state.asyncRoutine.stakeBTC || {},
    wallet: activeWalletSelector(state),
    balance: sbtcBalanceSelector(state),
    savingInfo: state.stake,
    btcAmount: formValueSelector('stakeForm')(state, 'btcAmount'),
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch)
  })
)

export default class StakeForm extends Component {
  submit = (data) => {
    this.props.actions.stakeBTC.requested({
      ...data,
      onSuccess: this.onSuccess,
      onError: this.onError
    })
  }

  onSuccess = () => {
    this.props.reset()
    message.success('save request sent!')
  }

  onError = (error) => {
    message.error(error)
  }

  render() {
    const { invalid, pristine, handleSubmit, stakeBTC, savingInfo, btcAmount, intl, balance } = this.props
    const loading = stakeBTC.requesting && !pristine
    const disabled = invalid || loading || pristine
    const exchangeRate = (savingInfo && savingInfo.current_phase_info && savingInfo.current_phase_info.exchange) ? savingInfo.current_phase_info.exchange : '--'
    const phaseId = (savingInfo && savingInfo.current_phase_id) ? +savingInfo.current_phase_id : '--'
    const exchangeRateNumber = exchangeRate
    const rbtcAmount = (exchangeRateNumber && btcAmount) ? (intl.formatNumber(+exchangeRateNumber * +btcAmount)) : '--'

    return (
      <Row className={style.stakeForm}>
        <Col span={12}>
          <div style={{ fontSize: '15px', fontWeight: '500', paddingBottom: '16px', marginTop: '20px' }} />
          <div>
            <Form onSubmit={handleSubmit(this.submit)} layout="vertical">
              <Form.Item {...formItemLayout} label={intl.formatMessage({ id: 'Current Phase' })}>
                <span className="ant-form-text">
                  {intl.formatMessage({ id: 'Phase {phaseId} (1 BTC = {exchangeRate} RBTC + 1 RS P{phaseId} Contract)' }, { phaseId, exchangeRate })}
                </span>
              </Form.Item>
              <Field
                name="btcAmount"
                type="text"
                component={NormalField}
                label={intl.formatMessage({ id: 'BTC Amount' })}
                placeholder={(balance && balance.freeBalance) ? intl.formatMessage({ id: '{available} available' }, { available: intl.formatNumber(balance.freeBalance, { minimumFractionDigits: 0, maximumFractionDigits: 8 }) }) : intl.formatMessage({ id: 'No BTC available' })}
                disabled={!(balance && balance.freeBalance)}
              />
              <Field
                name="rbtcAmount"
                type="text"
                label={intl.formatMessage({ id: 'RBTC Amount' })}
                component={NormalField}
                placeholder={rbtcAmount}
                disabled
              />
              <Field
                name="rsContract"
                type="text"
                label={intl.formatMessage({ id: 'RS Contract' })}
                component={NormalField}
                placeholder={btcAmount || '--'}
                disabled
              />
              <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" disabled={disabled} loading={loading}>{intl.formatMessage({ id: 'Save' })}</Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
        <Col span={12}>
          <Card>
            <div style={{ fontSize: '17px', fontWeight: '500', paddingBottom: '8px' }}>{intl.formatMessage({ id: 'Saving Guideline' })}</div>
            <div style={{ fontSize: '14px' }}>
              <div>{intl.formatMessage({ id: 'Step1 - Check status of current saving phase' })}</div>
              <div>{intl.formatMessage({ id: 'Step2 - Input the BTC amount that you want to save or to insert the RBTC amount that you want to get' })}</div>
              <div>{intl.formatMessage({ id: 'Step3 - Submit the saving request' })}</div>
              <div>{intl.formatMessage({ id: 'Step4 - Input the passcode to approve this request ' })}</div>
            </div>
            <div style={{ fontSize: '15px', fontWeight: '500', paddingBottom: '8px', marginTop: '18px' }}>{intl.formatMessage({ id: 'Note' })}</div>
            <div>{intl.formatMessage({ id: '- After staking is done successfully, RBTC will be deposited to you (Rio DeFi -> Asset -> RBTC) as well as RS contract (Rio DeFi -> Asset -> RBTC)' })}</div>
            <div>{intl.formatMessage({ id: '- RS contract is used to Unstake your BTC' })}</div>
            <div>{intl.formatMessage({ id: '- You could use the provided Calculator function to get the estimated receiving amount of RBTC (the calculated result is for reference due to staking phase changes)' })}</div>
            <div>{intl.formatMessage({ id: '- Staking Phases and exchange rate mapping table' })}</div>
            <div style={{ fontSize: '15px', fontWeight: '500', paddingBottom: '8px', marginTop: '18px' }}>{intl.formatMessage({ id: 'TBD' })}</div>
            <div>{intl.formatMessage({ id: 'Phase1: N BTC = 10,000*N RBTC + N RS P1 Contract' })}</div>
            <div>{intl.formatMessage({ id: 'Phase2: N BTC =   8,000*N RBTC + N RS P2 Contract' })}</div>
            <div>{intl.formatMessage({ id: 'Phase3: N BTC =   6,000*N RBTC + N RS P3 Contract' })}</div>
            <div>{intl.formatMessage({ id: 'Phase4: N BTC =   4,000*N RBTC + N RS P4 Contract' })}</div>
            <div>{intl.formatMessage({ id: 'Phase5: N BTC =   2,000*N RBTC + N RS P5 Contract' })}</div>
            <div>{intl.formatMessage({ id: '- The RBTC that you have staked will be delivered evenly to its staked phase and rest of phases, example ->' })}</div>
          </Card>
        </Col>
      </Row>
    )
  }
}
