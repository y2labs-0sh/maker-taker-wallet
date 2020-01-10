import React, { Component } from 'react'
import { bindActionCreators } from 'redux-helper'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { Card, Tabs, Table, Button, Modal } from 'antd'
import * as actions from 'actions/loan'
import { activeWalletSelector } from 'selectors/wallet'
import { accountLoansSelector } from 'selectors/loan'
import LoanForm from 'components/Form/LoanForm'
import RepayForm from 'components/Form/RepayForm'
import AddCollateralForm from 'components/Form/AddCollateralForm'
import BorrowForm from 'components/Form/BorrowForm'

const { TabPane } = Tabs

@injectIntl

@connect(
  state => ({
    wallet: activeWalletSelector(state),
    accountLoans: accountLoansSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch)
  })
)

export default class Loan extends Component {
  state = {
    showReplayModal: false,
    showAddCollateralModal: false,
    showBorrowModal: false
  }

  componentDidMount() {
    this.props.actions.getLoanAccountId.requested()
    this.props.actions.getCollateralAssetId.requested()
    this.props.actions.getLoanAssetId.requested()
    this.props.actions.getLiquidationThresholdLimit.requested()
    this.props.actions.getGlobalLiquidationThreshold.requested()
    this.props.actions.getNextLoanPackageId.requested()
    this.props.actions.getActiveLoanPackage.requested()
    this.props.actions.getGlobalWarningThreshold.requested()
    this.props.actions.getGlobalLiquidationThreshold.requested()
    this.props.actions.getLiquidatingLoans.requested()
    this.props.actions.subscribeBTCPrice()
  }

  toggleReplayModal = (id) => {
    if (typeof id === 'string') this.props.actions.setActiveLoanPackage(id)
    this.setState({ showReplayModal: !this.state.showReplayModal })
  }

  toggleAddCollateralModal = (id) => {
    if (typeof id === 'string') this.props.actions.setActiveLoanPackage(id)
    this.setState({ showAddCollateralModal: !this.state.showAddCollateralModal })
  }

  toggleBorrowModal = (id) => {
    if (typeof id === 'string') this.props.actions.setActiveLoanPackage(id)
    this.setState({ showBorrowModal: !this.state.showBorrowModal })
  }

  render() {
    const { accountLoans, intl } = this.props

    const columns = [{
      title: intl.formatMessage({ id: 'Loan ID' }),
      dataIndex: 'loan_id',
      key: 'loan_id',
    }, {
      title: intl.formatMessage({ id: 'Loan Package' }),
      dataIndex: 'loan_package',
      key: 'loan_package',
    }, {
      title: intl.formatMessage({ id: 'Due Date' }),
      dataIndex: 'due_date',
      key: 'due_date',
    }, {
      title: intl.formatMessage({ id: 'Status' }),
      dataIndex: 'status',
      key: 'status',
    }, {
      title: intl.formatMessage({ id: 'Loan Amount' }),
      dataIndex: 'loan_amount',
      key: 'loan_amount',
    }, {
      title: intl.formatMessage({ id: 'Available CL' }),
      dataIndex: 'available_cl',
      key: 'available_cl',
    }, {
      title: intl.formatMessage({ id: 'Collateral' }),
      dataIndex: 'collateral',
      key: 'collateral',
    }, {
      title: intl.formatMessage({ id: 'Current LTV' }),
      dataIndex: 'curr_orig_ltv',
      key: 'curr_orig_ltv',
    }, {
      title: intl.formatMessage({ id: 'Liquidation THD' }),
      dataIndex: 'liquidation_thd',
      key: 'liquidation_thd',
    }, {
      title: intl.formatMessage({ id: 'Action' }),
      key: 'action',
      render: (props) => {
        const { key } = props
        return (
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ paddingRight: '10px' }}>
              <Button onClick={this.toggleReplayModal.bind(this, key)}>{intl.formatMessage({ id: 'Repay' })}</Button>
            </div>
            <div style={{ paddingRight: '10px' }}>
              <Button onClick={this.toggleAddCollateralModal.bind(this, key)}>{intl.formatMessage({ id: 'Add Collateral' })}</Button>
            </div>
            <div style={{ paddingRight: '10px' }}>
              <Button onClick={this.toggleBorrowModal.bind(this, key)}>{intl.formatMessage({ id: 'Borrow' })}</Button>
            </div>
          </div>
        )
      }
    }]

    return (
      <Card style={{ overflow: 'scroll' }}>
        <Tabs defaultActiveKey="1" type="card">
          <TabPane tab={intl.formatMessage({ id: 'Loan' })} key="1">
            <LoanForm />
          </TabPane>
          <TabPane tab={intl.formatMessage({ id: 'Order List' })} key="2">
            <Table
              columns={columns}
              dataSource={accountLoans.map(item => ({
                key: item.id,
                loan_id: item.id,
                package_id: item.package_id,
                loan_package: item.terms ? `RIO ${item.terms} Days` : '--',
                due_date: `${intl.formatDate(new Date(item.due), {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}  ${intl.formatTime(new Date(item.due), {
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                })}`,
                status: item.status,
                loan_amount: item.loan_balance_total ? `${intl.formatNumber(item.loan_balance_total, { minimumFractionDigits: 0, maximumFractionDigits: 8 })} RIO` : '--',
                collateral: item.collateral_balance_available ? `${intl.formatNumber(item.collateral_balance_available, { minimumFractionDigits: 0, maximumFractionDigits: 8 })} BTC` : '--',
                available_cl: item.availableCreditLine ? `${intl.formatNumber(item.availableCreditLine, { minimumFractionDigits: 0, maximumFractionDigits: 2 })} USD` : '--',
                curr_orig_ltv: item.currentLTV ? `${intl.formatNumber(item.currentLTV * 100, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}%` : '--',
                liquidation_thd: item.liquidationTHO ? `${intl.formatNumber(item.liquidationTHO, { minimumFractionDigits: 0, maximumFractionDigits: 2 })} USD` : '--',
              }))}
            />
          </TabPane>
        </Tabs>
        {this.state.showReplayModal && (
          <Modal
            visible={true}
            title={intl.formatMessage({ id: 'Repay' })}
            closable
            onCancel={this.toggleReplayModal}
            footer={null}
          >
            <RepayForm onClose={this.toggleReplayModal} />
          </Modal>
        )}
        {this.state.showAddCollateralModal && (
          <Modal
            visible={true}
            title={intl.formatMessage({ id: 'Add Collateral' })}
            closable
            onCancel={this.toggleAddCollateralModal}
            footer={null}
          >
            <AddCollateralForm onClose={this.toggleAddCollateralModal} />
          </Modal>
        )}
        {this.state.showBorrowModal && (
          <Modal
            visible={true}
            title={intl.formatMessage({ id: 'Borrow' })}
            closable
            onCancel={this.toggleBorrowModal}
            footer={null}
          >
            <BorrowForm onClose={this.toggleBorrowModal} />
          </Modal>
        )}
      </Card>
    )
  }
}
