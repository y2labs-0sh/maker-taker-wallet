import React, { Component } from 'react'
import { bindActionCreators } from 'redux-helper'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { Card, Table, Button, Modal } from 'antd'
import * as walletActions from 'actions/wallet'
import * as assetActions from 'actions/asset'
import { activeWalletSelector } from 'selectors/wallet'
import { totalCreditLineSelector, availableCreditLineSelector } from 'selectors/creditLine'
import { activeBalanceSelector } from 'selectors/balance'
import DepositInfo from 'components/Modal/DepositInfo'
import TransferAssetForm from 'components/Form/TransferAssetForm'
import WithdrawAssetForm from 'components/Form/WithdrawAssetForm'
import PasswordPrompt from 'components/PasswordPrompt'
import { getIcon } from 'utils'

@injectIntl

@connect(
  state => ({
    locale: state.intl.locale,
    wallet: activeWalletSelector(state),
    balance: activeBalanceSelector(state),
    totalCreditLine: totalCreditLineSelector(state),
    availableCreditLine: availableCreditLineSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions,
      ...assetActions
    }, dispatch)
  })
)

export default class Asset extends Component {
  state = {
    showDepositModal: false,
    showTransferModal: false,
    showWithdrawModal: false
  }

  getBitcoinDepositAddress = (key) => {
    this.props.actions.getBitcoinDepositAddress.requested()
    this.toggleDepositModal(key)
  }

  toggleDepositModal = (key) => {
    this.props.actions.setActiveAsset(typeof key === 'string' ? key : null)
    this.setState({ showDepositModal: !this.state.showDepositModal })
  }

  toggleTransferModal = (key) => {
    this.props.actions.setActiveAsset(typeof key === 'string' ? key : null)
    this.setState({ showTransferModal: !this.state.showTransferModal })
  }

  toggleWithdrawModal = () => {
    this.setState({ showWithdrawModal: !this.state.showWithdrawModal })
  }

  render() {
    const { balance, intl, totalCreditLine, availableCreditLine } = this.props

    const columns = [{
      title: intl.formatMessage({ id: 'Name' }),
      key: 'name',
      render: (props) => {
        const { name } = props
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            <img src={getIcon(name)} alt={name} style={{ height: '30px', width: '30px', marginRight: '16px' }} />
            <div>{name}</div>
          </div>
        )
      }
    }, {
      title: intl.formatMessage({ id: 'Total' }),
      dataIndex: 'total',
      key: 'total',
    }, {
      title: intl.formatMessage({ id: 'Available/Locked' }),
      dataIndex: 'available_locked',
      key: 'available_locked',
    }, {
      title: intl.formatMessage({ id: 'Available/Total Credit Line' }),
      dataIndex: 'available_total_credit_line',
      key: 'available_total_credit_line',
    }, {
      title: intl.formatMessage({ id: 'Action' }),
      key: 'action',
      render: (props) => {
        const { name, key } = props

        if (name === 'BTC') {
          return (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <div style={{ paddingRight: '10px' }}>
                <Button onClick={this.getBitcoinDepositAddress.bind(this, key)}>{intl.formatMessage({ id: 'Deposit' })}</Button>
              </div>
              <div style={{ paddingRight: '10px' }}>
                <Button onClick={this.toggleWithdrawModal}>{intl.formatMessage({ id: 'Withdraw' })}</Button>
              </div>
              <div style={{ paddingRight: '10px' }}>
                <Button><Link to="saving">{intl.formatMessage({ id: 'Save' })}</Link></Button>
              </div>
              <div style={{ paddingRight: '10px' }}>
                <Button><Link to="loan">{intl.formatMessage({ id: 'Borrow' })}</Link></Button>
              </div>
            </div>
          )
        }

        return (
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ paddingRight: '10px' }}>
              <Button onClick={this.toggleTransferModal.bind(this, key)}>{intl.formatMessage({ id: 'Send' })}</Button>
            </div>
            <div style={{ paddingRight: '10px' }}>
              <Button onClick={this.toggleDepositModal.bind(this, key)}>{intl.formatMessage({ id: 'Receive' })}</Button>
            </div>
          </div>
        )
      }
    }]

    return (
      <Card style={{ overflow: 'scroll' }}>
        <div style={{ fontSize: '17px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {intl.formatMessage({ id: 'Asset' })}
          <Button type="primary"><Link to="contact">{intl.formatMessage({ id: 'Contact' })}</Link></Button>
        </div>
        <Table
          columns={columns}
          dataSource={balance.map(item => ({
            key: item.id,
            name: item.symbol,
            total: isNaN(item.totalBalance) ? '--' : intl.formatNumber(item.totalBalance, { minimumFractionDigits: 8, maximumFractionDigits: 8 }),
            available_locked: `${isNaN(item.freeBalance) ? '--' : intl.formatNumber(item.freeBalance, { minimumFractionDigits: 8, maximumFractionDigits: 8 })}/${isNaN(item.lockBalance) ? '--' : intl.formatNumber(item.lockBalance, { minimumFractionDigits: 8, maximumFractionDigits: 8 })}`,
            available_total_credit_line: item.symbol === 'BTC' ? ((isNaN(availableCreditLine) ? '--' : intl.formatNumber(availableCreditLine, { minimumFractionDigits: 2, maximumFractionDigits: 2 })) + '/' + (isNaN(totalCreditLine) ? '--' : intl.formatNumber(totalCreditLine, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))) : '--/--' // eslint-disable-line
          }))}
          pagination={false}
          style={{ marginBottom: '40px' }}
        />
        {this.state.showDepositModal && (
          <Modal
            visible={true}
            title={intl.formatMessage({ id: 'Deposit' })}
            closable
            onCancel={this.toggleDepositModal}
            footer={null}
          >
            <DepositInfo />
          </Modal>
        )}
        {this.state.showTransferModal && (
          <Modal
            visible={true}
            title={intl.formatMessage({ id: 'Transfer' })}
            closable
            onCancel={this.toggleTransferModal}
            footer={null}
          >
            <TransferAssetForm />
          </Modal>
        )}
        {this.state.showWithdrawModal && (
          <Modal
            visible={true}
            title={intl.formatMessage({ id: 'Withdraw' })}
            closable
            onCancel={this.toggleWithdrawModal}
            footer={null}
          >
            <WithdrawAssetForm onClose={() => this.toggleWithdrawModal()} />
          </Modal>
        )}
        <PasswordPrompt />
      </Card>
    )
  }
}
