import React, { Component } from 'react'
import { bindActionCreators } from 'redux-helper'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { injectIntl } from 'react-intl'
import { NormalField } from 'components/FieldTemplate'
import * as actions from 'actions/stake'
import { activeWalletSelector } from 'selectors/wallet'
import { rbtcBalanceSelector, phaseListBalanceSelector, selectedPhaseAssetBalanceSelector } from 'selectors/balance'
import { currentPhaseAssetIdSelector } from 'selectors/stake'
import { Row, Col, Card, Form, Button, message, Select } from 'antd'
// import style from './style.css'

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

const { Option } = Select

const validate = () => {
  const errors = {}

  /* if (!values.receiver) {
   *   errors.stakeAmount = 'btc amount is required'
   * } */

  return errors
}

@injectIntl

@reduxForm({ form: 'unstakeForm', validate })

@connect(
  state => ({
    unstakeBTC: state.asyncRoutine.unstakeBTC || {},
    wallet: activeWalletSelector(state),
    balance: rbtcBalanceSelector(state),
    savingInfo: state.stake,
    rscAmount: formValueSelector('unstakeForm')(state, 'rscAmount'),
    phaseListBalance: phaseListBalanceSelector(state),
    currentPhaseAssetId: currentPhaseAssetIdSelector(state),
    phaseAssetBalance: selectedPhaseAssetBalanceSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch)
  })
)

export default class UnstakeForm extends Component {
  submit = (data) => {
    const { phaseAssetBalance/* , balance */ } = this.props
    const { rscAmount } = data

    /* const exchangeRate = phaseAssetBalance && phaseAssetBalance.exchange */
    /* const rbtcAmount = exchangeRate && rscAmount && (+exchangeRate * +rscAmount)
     * const rbtcBalance = balance.freeBalance */

    /* if (!rbtcBalance || rbtcAmount > rbtcBalance) {
     *   message.error("You don't have enough RBTC")
     * } */

    this.props.actions.unstakeBTC.requested({
      rscAmount,
      rscAssetId: phaseAssetBalance && phaseAssetBalance.contract,
      onSuccess: this.onSuccess,
      onError: this.onError
    })
  }

  onSuccess = () => {
    this.props.reset()
    message.success('redeem request sent!')
  }

  onError = (error) => {
    message.error(error)
  }

  handleSelectChange = (assetId) => {
    this.props.actions.selectPhaseAsset(assetId)
  }

  render() {
    const { handleSubmit, pristine, invalid, unstakeBTC, rscAmount, intl, phaseListBalance, balance, phaseAssetBalance } = this.props
    const loading = unstakeBTC.requesting && !pristine
    const disabled = invalid || loading || pristine

    const hasPhaseAssetBalance = !!phaseAssetBalance
    const exchangeRate = (phaseAssetBalance && phaseAssetBalance.exchange) ? phaseAssetBalance.exchange : '--'
    const rbtcAmount = (
      (exchangeRate && rscAmount) ? intl.formatNumber(+exchangeRate * +rscAmount, { minimumFractionDigits: 0, maximumFractionDigits: 8 }) : (
        (balance && balance.freeBalance) ? intl.formatMessage({ id: '{available} available' }, { available: intl.formatNumber(balance.freeBalance, { minimumFractionDigits: 0, maximumFractionDigits: 8 }) }) : (
          intl.formatMessage({ id: 'No RBTC available' })
        )
      )
    )

    return (
      <Row>
        <Col span={12}>
          <div style={{ fontSize: '15px', fontWeight: '500', paddingBottom: '16px', marginTop: '20px' }} />
          <div>
            <Form onSubmit={handleSubmit(this.submit)} layout="vertical">
              <Field
                name="rscAmount"
                type="text"
                component={NormalField}
                label={intl.formatMessage({ id: 'RS Contract Amount' })}
                placeholder={
                hasPhaseAssetBalance
                ? `${(phaseAssetBalance && phaseAssetBalance.freeBalance) ? intl.formatNumber(phaseAssetBalance.freeBalance, { minimumFractionDigits: 0, maximumFractionDigits: 8 }) : 0} available`
                : intl.formatMessage({ id: 'No RS Contract available' })
                }
                disabled={!hasPhaseAssetBalance || (!balance || !balance.freeBalance)}
                addonAfter={!!hasPhaseAssetBalance && (
                  <Select key={String(phaseAssetBalance.contract)} defaultValue={String(phaseAssetBalance.contract)} style={{ width: 80 }} onChange={this.handleSelectChange} disabled={!hasPhaseAssetBalance}>
                    {phaseListBalance.map(item => <Option key={item.contract} value={String(item.contract)}>{item.symbol}</Option>)}
                  </Select>
                )}
              />
              <Field
                name="rbtcAmount"
                type="text"
                component={NormalField}
                placeholder={rbtcAmount}
                label={intl.formatMessage({ id: 'RBTC Amount' })}
                disabled
              />
              <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" disabled={disabled} loading={loading}>{intl.formatMessage({ id: 'Redeem' })}</Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
        <Col span={12}>
          <Card>
            <div style={{ fontSize: '17px', fontWeight: '500', paddingBottom: '8px' }}>{intl.formatMessage({ id: 'Redeem Guideline' })}</div>
            <div>{intl.formatMessage({ id: 'Step1 - Select the RS token, and then input the desired amount' })}</div>
            <div>{intl.formatMessage({ id: `Step2 - Based on selected RS token and inserted amount, platform will provide you the amount of RBTC that you will need in this time's redeem request, if you don't have sufficent RBTC, you could deposit RBTC via Deposit function` /* eslint-disable-line */ })}</div>
            <div>{intl.formatMessage({ id: 'Step3 - Click Submit to send your redeem request, once this request is confirmed, your BTC will be redeemed to Asset -> BTC on RIO DeFi platform' })}</div>
            <div style={{ fontSize: '15px', fontWeight: '500', paddingBottom: '8px', marginTop: '18px' }}>{intl.formatMessage({ id: 'Note' })}</div>
            <div>{intl.formatMessage({ id: '- After redeem request is sent successfully, relevant RBTC and RS contract will be locked till the whole unstaking process is finished' })}</div>
            <div>{intl.formatMessage({ id: '-  Saving Program phases and exchange rate mapping table' })}</div>
            <div style={{ fontSize: '15px', fontWeight: '500', paddingBottom: '8px', marginTop: '18px' }}>{intl.formatMessage({ id: 'TBD' })}</div>
            <div>{intl.formatMessage({ id: 'Phase1: 1 BTC = 10,000 RBTC + 1 RS P1 Contract' })}</div>
            <div>{intl.formatMessage({ id: 'Phase2: 1 BTC = 9,000 RBTC + 1 RS P2 Contract' })}</div>
            <div>{intl.formatMessage({ id: 'Phase3: 1 BTC = 8,000 RBTC + 1 RS P3 Contract' })}</div>
            <div>{intl.formatMessage({ id: 'Phase4: 1 BTC = 7,000 RBTC + 1 RS P4 Contract' })}</div>
            <div>{intl.formatMessage({ id: 'Phase5: 1 BTC = 6,000 RBTC + 1 RS P5 Contract' })}</div>
          </Card>
        </Col>
      </Row>
    )
  }
}
