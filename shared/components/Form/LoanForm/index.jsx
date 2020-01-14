import React, { Component } from 'react'
import { bindActionCreators } from 'redux-helper'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { injectIntl } from 'react-intl'
import { NormalField } from 'components/FieldTemplate'
import * as actions from 'actions/loan'
import { activeWalletSelector } from 'selectors/wallet'
import { sbtcBalanceSelector } from 'selectors/balance'
import {
  loanPackagesSelector,
  btcPriceSelector,
  ltvLimitSelector,
  activePackageSelector,
  globalWarningThresholdSelector,
  globalLiquidationThresholdSelector,
  collateralBTCAmountSelector
} from 'selectors/loan'
import { availableCreditLineSelector, totalCreditLineSelector } from 'selectors/creditLine'
import { Row, Col, Card, Form, Button, message, Modal } from 'antd'
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
    },
  },
}
/*
 * const formItemLayout = {
 *   labelCol: {
 *     xs: { span: 24 },
 *     sm: { span: 6 },
 *   },
 *   wrapperCol: {
 *     xs: { span: 24 },
 *     sm: { span: 14 },
 *   },
 * } */

const validate = (values, props) => {
  const { btcAmount, btcPrice, ltvLimit } = props
  const maximumRIOAmount = btcAmount * btcPrice * ltvLimit

  const errors = {}

  if (!values.btcAmount) {
    errors.btcAmount = 'BTC amount is required'
  }

  if (!values.rioAmount) {
    errors.rioAmount = 'RIO amount is required'
  } else if (!isNaN(maximumRIOAmount) && +maximumRIOAmount < +values.rioAmount) {
    errors.rioAmount = 'Insufficient RIO amount'
  }

  return errors
}

@injectIntl

@connect(
  state => ({
    applyLoan: state.asyncRoutine.applyLoan || {},
    wallet: activeWalletSelector(state),
    loanPackages: loanPackagesSelector(state),
    activePackage: activePackageSelector(state),
    balance: sbtcBalanceSelector(state),
    totalCreditLine: totalCreditLineSelector(state),
    availableCreditLine: availableCreditLineSelector(state),
    btcPrice: btcPriceSelector(state),
    ltvLimit: ltvLimitSelector(state),
    globalWarningThreshold: globalWarningThresholdSelector(state),
    globalLiquidationThreshold: globalLiquidationThresholdSelector(state),
    collateralBTCAmount: collateralBTCAmountSelector(state),
    btcAmount: formValueSelector('loanForm')(state, 'btcAmount'),
    rioAmount: formValueSelector('loanForm')(state, 'rioAmount')
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch)
  })
)

@reduxForm({ form: 'loanForm', validate })

export default class LoanForm extends Component {
  state = {
    showLoanForm: false
  }

  openLoanForm = (id) => {
    this.props.actions.setActiveLoanPackage(id)
    this.setState({ showLoanForm: true })
  }

  closeLoanForm = () => {
    this.props.actions.setActiveLoanPackage(null)
    this.setState({ showLoanForm: false })
    this.props.reset()
  }

  openLoanDetail = (id) => {
    this.props.actions.setActiveLoanPackage(id)
  }

  closeLoanDetail = () => {
    this.props.actions.setActiveLoanPackage(null)
  }

  submit = (data) => {
    const { activePackage } = this.props

    if (activePackage && activePackage.id) {
      this.props.actions.applyLoan.requested({
        ...data,
        packageId: activePackage.id,
        onSuccess: this.onSuccess,
        onError: this.onError
      })
    }
  }

  onSuccess = () => {
    this.props.reset()
    message.success('loan request sent!')
    this.closeLoanForm()
  }

  onError = (error) => {
    message.error(error)
  }

  render() {
    const { invalid, pristine, handleSubmit, applyLoan, loanPackages, intl, balance, availableCreditLine, btcAmount, btcPrice, ltvLimit, rioAmount, activePackage, globalWarningThreshold, globalLiquidationThreshold, collateralBTCAmount } = this.props
    const loading = applyLoan.requesting && !pristine
    const disabled = invalid || loading || pristine

    const hasSBTCBalance = balance && balance.freeBalance
    const available = balance ? intl.formatNumber(balance.freeBalance, { minimumFractionDigits: 0, maximumFractionDigits: 8 }) : '--'
    const collateral = collateralBTCAmount ? intl.formatNumber(collateralBTCAmount, { minimumFractionDigits: 0, maximumFractionDigits: 8 }) : '--'
    const tcl = (typeof availableCreditLine === 'number') ? intl.formatNumber(availableCreditLine, { minimumFractionDigits: 0, maximumFractionDigits: 2 }) : '--'

    const maximumRIOAmount = isNaN(btcAmount * btcPrice * ltvLimit) ? '--' : intl.formatNumber((btcAmount * btcPrice * ltvLimit), { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    const availableRIOAmount = isNaN((btcAmount * btcPrice * ltvLimit) - (+rioAmount)) ? '--' : intl.formatNumber(((btcAmount * btcPrice * ltvLimit) - (+rioAmount)), { minimumFractionDigits: 0, maximumFractionDigits: 2 })

    const interest = rioAmount && activePackage && activePackage.interest_rate_hourly && activePackage.terms && intl.formatNumber(activePackage.interest_rate_hourly * 24 * 365 * rioAmount, { minimumFractionDigits: 0, maximumFractionDigits: 8 })
    const received = isNaN(rioAmount - interest) ? '--' : intl.formatNumber(rioAmount - interest, { minimumFractionDigits: 0, maximumFractionDigits: 8 })

    return (
      <Row className={style.loanForm}>
        <Col span={12}>
          <div className={style.balances}>
            <div className={style.balance}>
              <div className={style.balanceLabel}>{intl.formatMessage({ id: 'Available Credit Line' })}</div>
              <div className={style.balanceAmount}>
                <div className={style.balanceSymbol}>USD</div>
                <div className={style.balanceText}>{tcl}</div>
              </div>
            </div>
            <div className={style.balance}>
              <div className={style.balanceLabel}>{intl.formatMessage({ id: 'Available' })} | {intl.formatMessage({ id: 'Collaterized BTC' })}</div>
              <div className={style.balanceAmount}>
                <div className={style.balanceSymbol}>BTC</div>
                <div className={style.balanceText}>{available} | {collateral}</div>
              </div>
            </div>
          </div>
          {this.state.showLoanForm && (
            <Modal
              visible={true}
              title={intl.formatMessage({ id: 'Loan' })}
              closable
              onCancel={this.closeLoanForm}
              footer={null}
            >
              <div className={style.form}>
                <Form layout="vertical" onSubmit={handleSubmit(this.submit)}>
                  <Field
                    name="btcAmount"
                    type="text"
                    component={NormalField}
                    placeholder={intl.formatMessage({ id: '{available} BTC Available' }, { available })}
                    addonAfter="BTC"
                    label={intl.formatMessage({ id: 'BTC Amount' })}
                    disabled={!hasSBTCBalance}
                  />
                  <Field
                    name="rioAmount"
                    type="text"
                    component={NormalField}
                    label={intl.formatMessage({ id: 'RIO Amount' })}
                    placeholder={maximumRIOAmount ? intl.formatMessage({ id: '{maximumRIOAmount} RIO Maximum' }, { maximumRIOAmount }) : intl.formatMessage({ id: 'RIO Amount' })}
                    addonAfter="RIO"
                    disabled={!hasSBTCBalance}
                  />
                  <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" disabled={disabled} loading={loading}>{intl.formatMessage({ id: 'apply' })}</Button>
                  </Form.Item>
                </Form>
                <div className={style.loanInfoList}>
                  <div className={style.loanInfo}>
                    <div className={style.loanInfoLabel}>{intl.formatMessage({ id: 'Total Loan Amount' })}:</div>
                    <div className={style.loanInfoValue}>{isNaN(rioAmount) ? '--' : intl.formatNumber(rioAmount, { minimumFractionDigits: 0, maximumFractionDigits: 2 })} RIO</div>
                  </div>
                  <div className={style.loanInfo}>
                    <div className={style.loanInfoLabel}>{intl.formatMessage({ id: 'Term' })}:</div>
                    <div className={style.loanInfoValue}>{intl.formatMessage({ id: '{terms} Days' }, { terms: activePackage && activePackage.terms })}</div>
                  </div>
                  <div className={style.loanInfo}>
                    <div className={style.loanInfoLabel}>{intl.formatMessage({ id: 'Interest Rate (APR)' })}:</div>
                    <div className={style.loanInfoValue}>{activePackage && activePackage.interest_rate_hourly && intl.formatNumber(activePackage.interest_rate_hourly * 100 * 24 * 365, { minimumFractionDigits: 0, maximumFractionDigits: 4 })}%</div>
                  </div>
                  <div className={style.loanInfo}>
                    <div className={style.loanInfoLabel}>{intl.formatMessage({ id: 'Interest' })}:</div>
                    <div className={style.loanInfoValue}>{activePackage && activePackage.interest_rate_hourly && activePackage.terms && intl.formatNumber(activePackage.interest_rate_hourly * 100 * 24 * (+activePackage.terms), { minimumFractionDigits: 0, maximumFractionDigits: 4 })} RIO</div>
                  </div>
                  <div className={style.loanInfo}>
                    <div className={style.loanInfoLabel}>{intl.formatMessage({ id: 'Fee' })}:</div>
                    <div className={style.loanInfoValue}>0.1 DFX</div>
                  </div>
                  <div className={style.loanInfo}>
                    <div className={style.loanInfoLabel}>{intl.formatMessage({ id: 'You would receive' })}:</div>
                    <div className={style.loanInfoValue} style={{ fontSize: '20px' }}>{received} RIO</div>
                  </div>
                  <div className={style.loanInfo}>
                    <div className={style.loanInfoLabel}>{intl.formatMessage({ id: 'Available/Total Credit Line' })}:</div>
                    <div className={style.loanInfoValue}>{availableRIOAmount} / {maximumRIOAmount} USD</div>
                  </div>
                  <div className={style.loanInfo}>
                    <div className={style.loanInfoLabel}>{intl.formatMessage({ id: 'Current Loan To Value (LTV)' })}:</div>
                    <div className={style.loanInfoValue}>{isNaN(rioAmount / (btcAmount * btcPrice)) ? '--' : intl.formatNumber((rioAmount / (btcAmount * btcPrice)) * 100, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}%</div>
                  </div>
                  <div className={style.loanInfo}>
                    <div className={style.loanInfoLabel}>{intl.formatMessage({ id: 'BTC Current Price' })}:</div>
                    <div className={style.loanInfoValue}>{btcPrice && intl.formatNumber(btcPrice, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</div>
                  </div>
                  <div className={style.loanInfo}>
                    <div className={style.loanInfoLabel}>{intl.formatMessage({ id: 'Warning THD' })}:</div>
                    <div className={style.loanInfoValue}>{isNaN(rioAmount / (btcAmount * globalWarningThreshold)) ? '--' : intl.formatNumber((rioAmount / (btcAmount * globalWarningThreshold)), { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</div>
                  </div>
                  <div className={style.loanInfo}>
                    <div className={style.loanInfoLabel}>{intl.formatMessage({ id: 'Liquidation THD' })}:</div>
                    <div className={style.loanInfoValue}>{isNaN(rioAmount / (btcAmount * globalLiquidationThreshold)) ? '--' : intl.formatNumber((rioAmount / (btcAmount * globalLiquidationThreshold)), { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</div>
                  </div>
                </div>
              </div>
            </Modal>
          )}
          <div className={style.title}>{intl.formatMessage({ id: 'Loan Packages' })}</div>
          <div className={style.packages}>
            {loanPackages.map(item => (
              <div key={item.id} className={style.package}>
                <div className={style.packageTop}>
                  <div className={style.packageTitle}>{intl.formatMessage({ id: 'RIO {terms} DAYS' }, { terms: item.terms })}</div>
                </div>
                <div className={style.packageBottom}>
                  <div className={style.packageInfo}>
                    <div className={style.packageInfoValue} style={{ color: 'rgb(255, 102, 102)', fontSize: '20px', fontWeight: 'bold', marginBottom: 0 }}>{item && item.interest_rate_hourly && intl.formatNumber(item.interest_rate_hourly * 100 * 24 * 365, { minimumFractionDigits: 0, maximumFractionDigits: 4 })}%</div>
                    <div className={style.packageInfoLabel}>{intl.formatMessage({ id: 'APR' })}</div>
                  </div>
                  <div className={style.packageInfo}>
                    <div className={style.packageInfoValue}>{intl.formatMessage({ id: 'RIO {terms} DAYS' }, { terms: item.terms })}</div>
                    <div className={style.packageInfoLabel}>{intl.formatMessage({ id: 'Term' })}</div>
                  </div>
                  <div className={style.packageInfo}>
                    <div className={style.packageInfoValue}>{intl.formatNumber(item.min, { minimumFractionDigits: 0, maximumFractionDigits: 8 })} BTC</div>
                    <div className={style.packageInfoLabel}>{intl.formatMessage({ id: 'Min. Collateral Amount' })}</div>
                  </div>
                  <div className={style.packageInfo}>
                    <Button type="primary" onClick={this.openLoanForm.bind(this, item.id)}>{intl.formatMessage({ id: 'Apply' })}</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Col>
        <Col span={12}>
          <Card>
            <div style={{ fontSize: '17px', fontWeight: '500', paddingBottom: '8px' }}>{intl.formatMessage({ id: 'Loan Guideline' })}</div>
            <div style={{ fontSize: '14px' }}>
              <div>{intl.formatMessage({ id: 'Step1 - Select your desired loan package' })}</div>
              <div>{intl.formatMessage({ id: 'Step2 - Input the desired amount of BTC you wanna put as collateral' })}</div>
              <div>{intl.formatMessage({ id: 'Step3 - Input the amount of RIO you wanna borrow (your maximum borrowing power is equal to your Available Credit Line based on the BTC your are about to collaterize on Step2)' })}</div>
              <div>{intl.formatMessage({ id: 'Step4 - Submit your loan request' })}</div>
              <div>{intl.formatMessage({ id: 'Step5 - Enter passcode to confirm your requet, once this request is confirmed, you will get your RIO on Rio DeFi platform' })}</div>
            </div>
            <div style={{ fontSize: '15px', fontWeight: '500', paddingBottom: '8px', marginTop: '18px' }}>{intl.formatMessage({ id: 'Note' })}</div>
            <div>{intl.formatMessage({ id: '- If you wanna increase your Credit Line, simply just deposit BTC to Rio DeFi platform' })}</div>
            <div>{intl.formatMessage({ id: '- Value of your Credit Line is linked to current BTC market price (in USD)' })}</div>
            <div>{intl.formatMessage({ id: '- You could repay your loan at anytime before due date but charged interest won\'t be refunded' })}</div>
            <div>{intl.formatMessage({ id: '- As long as your available credit line of the active loan is not 0, you are able to borrow more based on the same package you applied' })}</div>
            <div>{intl.formatMessage({ id: '- Platform will auto-liquidate your BTC in following situation' })}</div>
            <div>{intl.formatMessage({ id: '> Once BTC price hits Liquidation Threshold Price, ' })}</div>
            <div>{intl.formatMessage({ id: '> Once the loan is expired' })}</div>
          </Card>
        </Col>
      </Row>
    )
  }
}
