import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'redux-helper'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { Card, Table, Button, Tabs, Dropdown, Menu, Icon } from 'antd'
import * as actions from 'actions/transaction'
import {
  activeTransactionSelector,
  activeScanTransactionSelector,
  activeTransferTransactionSelector,
  activeSavingTransactionSelector,
  activeLoanTransactionSelector
} from 'selectors/transaction'
import { activeWalletSelector } from 'selectors/wallet'
import { toShortAddress } from 'utils'
import { SCAN_API } from 'constants/env'
import style from './style.css'

const { TabPane } = Tabs

@injectIntl

@connect(
  state => ({
    wallet: activeWalletSelector(state),
    transaction: activeTransactionSelector(state),
    scanTransaction: activeScanTransactionSelector(state),
    transferTransaction: activeTransferTransactionSelector(state),
    loanTransaction: activeLoanTransactionSelector(state),
    savingTransaction: activeSavingTransactionSelector(state),
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch)
  })
)

export default class Transaction extends Component {
  state = {
    type: 'All',
    status: 'All',
    asset: 'RIO Assets'
  }

  componentDidMount() {
    const { wallet } = this.props

    if (wallet) {
      this.props.actions.getWalletDepositHistory.requested()
      this.props.actions.getWalletWithdrawHistory.requested()
      this.props.actions.getTransactionHistory.requested()
      this.props.actions.getTransferTransactionHistory.requested()
      this.props.actions.getSavingTransactionHistory.requested()
      this.props.actions.getLoanTransactionHistory.requested()
    }
  }

  onAssetFilterClick = (asset) => {
    this.setState({ asset })
  }

  onStatusFilterClick = (status) => {
    this.setState({ status })
  }

  onTypeFilterClick = (type) => {
    this.setState({ type })
  }

  render() {
    const { transaction, intl, wallet, scanTransaction, transferTransaction, loanTransaction, savingTransaction } = this.props

    console.log('savingTransaction', savingTransaction)
    console.log('transferTransaction', transferTransaction)

    const columns = [{
      title: intl.formatMessage({ id: 'Date' }),
      dataIndex: 'date',
      key: 'data',
    }, {
      title: intl.formatMessage({ id: 'Asset' }),
      dataIndex: 'asset',
      key: 'asset',
    }, {
      title: intl.formatMessage({ id: 'Type' }),
      dataIndex: 'type',
      key: 'type',
    }, {
      title: intl.formatMessage({ id: 'Address' }),
      dataIndex: 'address',
      key: 'address',
    }, {
      title: intl.formatMessage({ id: 'Amount' }),
      dataIndex: 'amount',
      key: 'amount',
    }, {
      title: intl.formatMessage({ id: 'Status' }),
      dataIndex: 'status',
      key: 'status',
    }]

    const scanColumns = [{
      title: intl.formatMessage({ id: 'Block ID' }),
      key: 'block',
      render: (props) => {
        const { block } = props

        return (<a href={`${SCAN_API}/block/${block}`} target="_blank" rel="noopener noreferrer">{block}</a>)
      }
    }, {
      title: intl.formatMessage({ id: 'Hash' }),
      /* dataIndex: 'hash', */
      key: 'hash',
      render: (props) => {
        const { hash } = props

        const shortHash = hash.length > 20 ? `${hash.slice(0, 10)}...${hash.slice(-10)}` : hash
        return (<a href={`${SCAN_API}/transaction/${hash}`} target="_blank" rel="noopener noreferrer">{shortHash}</a>)
      }
    }, {
      title: intl.formatMessage({ id: 'Module' }),
      dataIndex: 'module',
      key: 'module',
    }]

    const loanColumns = [{
      title: intl.formatMessage({ id: 'ID' }),
      dataIndex: 'id',
      key: 'id'
    }, {
      title: intl.formatMessage({ id: 'Time' }),
      dataIndex: 'datetime',
      key: 'datetime'
    }, {
      title: intl.formatMessage({ id: 'Block ID' }),
      key: 'block',
      render: (props) => {
        const { block } = props

        return (<a href={`${SCAN_API}/block/${block}`} target="_blank" rel="noopener noreferrer">{block}</a>)
      }
    }, {
      title: intl.formatMessage({ id: 'Account' }),
      key: 'account',
      render: (props) => {
        const { account } = props

        return (<a href={`${SCAN_API}/account/${account}`} target="_blank" rel="noopener noreferrer">{toShortAddress(account)}</a>)
      }
    }, {
      title: intl.formatMessage({ id: 'Loan Amount' }),
      dataIndex: 'balance',
      key: 'balance'
    }, {
      title: intl.formatMessage({ id: 'Collateral Amount' }),
      dataIndex: 'collateral_balance_original',
      key: 'collateral_balance_original'
    }, {
      title: intl.formatMessage({ id: 'Event' }),
      dataIndex: 'event',
      key: 'event'
    }, {
      title: intl.formatMessage({ id: 'Status' }),
      dataIndex: 'status',
      key: 'status'
    }]

    const savingColumns = [{
      title: intl.formatMessage({ id: 'ID' }),
      dataIndex: 'id',
      key: 'id'
    }, {
      title: intl.formatMessage({ id: 'Time' }),
      dataIndex: 'datetime',
      key: 'datetime'
    }, {
      title: intl.formatMessage({ id: 'Block ID' }),
      key: 'block',
      render: (props) => {
        const { block } = props

        return (<a href={`${SCAN_API}/block/${block}`} target="_blank" rel="noopener noreferrer">{block}</a>)
      }
    }, {
      title: intl.formatMessage({ id: 'Account' }),
      key: 'account',
      render: (props) => {
        const { account } = props

        return (<a href={`${SCAN_API}/account/${account}`} target="_blank" rel="noopener noreferrer">{toShortAddress(account)}</a>)
      }
    }, {
      title: intl.formatMessage({ id: 'Asset' }),
      dataIndex: 'asset',
      key: 'asset'
    }, {
      title: intl.formatMessage({ id: 'Amount' }),
      dataIndex: 'balance',
      key: 'balance'
    }, {
      title: intl.formatMessage({ id: 'Event' }),
      dataIndex: 'event',
      key: 'event'
    }]

    const transferColumns = [{
      title: intl.formatMessage({ id: 'ID' }),
      dataIndex: 'id',
      key: 'id'
    }, {
      title: intl.formatMessage({ id: 'Time' }),
      dataIndex: 'datetime',
      key: 'datetime'
    }, {
      title: intl.formatMessage({ id: 'Block ID' }),
      key: 'block',
      render: (props) => {
        const { block } = props

        return (<a href={`${SCAN_API}/block/${block}`} target="_blank" rel="noopener noreferrer">{block}</a>)
      }
    }, {
      title: intl.formatMessage({ id: 'Asset' }),
      dataIndex: 'asset',
      key: 'asset'
    }, {
      title: intl.formatMessage({ id: 'Sender' }),
      key: 'sender',
      render: (props) => {
        const { sender } = props

        return (<a href={`${SCAN_API}/account/${sender}`} target="_blank" rel="noopener noreferrer">{toShortAddress(sender)}</a>)
      }
    }, {
      title: intl.formatMessage({ id: 'Receiver' }),
      key: 'receiver',
      render: (props) => {
        const { receiver } = props

        return (<a href={`${SCAN_API}/account/${receiver}`} target="_blank" rel="noopener noreferrer">{toShortAddress(receiver)}</a>)
      }
    }, {
      title: intl.formatMessage({ id: 'Amount' }),
      dataIndex: 'amount',
      key: 'amount'
    }, {
      title: intl.formatMessage({ id: 'Fee' }),
      dataIndex: 'fee',
      key: 'fee'
    }]

    return (
      <Card style={{ overflow: 'scroll' }}>
        <Tabs defaultActiveKey="1" size="small">
          <TabPane tab={intl.formatMessage({ id: 'All' })} key="1">
            <Table
              columns={scanColumns}
              dataSource={scanTransaction && scanTransaction
                .map(item => ({
                  key: item.id,
                  block: item.attributes.block_id,
                  hash: item.attributes.extrinsic_hash,
                  module: item.attributes.module_id
                }))}
            />
          </TabPane>
          <TabPane tab={intl.formatMessage({ id: 'My Wallet' })} key="2">
            <div className={style.options}>
              <div className={style.option}>
                <div className={style.optionTitle}>{intl.formatMessage({ id: 'Asset' })}:</div>
                <Dropdown
                  overlay={
                    <Menu>
                      {/* <Menu.Item key="1" onClick={this.onAssetFilterClick.bind(this, 'All')}>
                          All
                          </Menu.Item> */}
                      <Menu.Item key="1" onClick={this.onAssetFilterClick.bind(this, 'BTC')}>
                        BTC
                      </Menu.Item>
                      <Menu.Item key="2" onClick={this.onAssetFilterClick.bind(this, 'RIO Assets')}>
                        RIO Assets
                      </Menu.Item>
                    </Menu>
                  }
                  disabled={!wallet}
                >
                  <Button>{this.state.asset} <Icon type="down" /></Button>
                </Dropdown>
              </div>
              {this.state.asset === 'BTC' && (
                <Fragment>
                  <div className={style.option}>
                    <div className={style.optionTitle}>{intl.formatMessage({ id: 'Type' })}:</div>
                    <Dropdown
                      overlay={
                        <Menu>
                          <Menu.Item key="1" onClick={this.onTypeFilterClick.bind(this, 'All')}>
                            {intl.formatMessage({ id: 'All' })}
                          </Menu.Item>
                          <Menu.Item key="2" onClick={this.onTypeFilterClick.bind(this, 'Receive')}>
                            {intl.formatMessage({ id: 'Receive' })}
                          </Menu.Item>
                          <Menu.Item key="3" onClick={this.onTypeFilterClick.bind(this, 'Send')}>
                            {intl.formatMessage({ id: 'Send' })}
                          </Menu.Item>
                        </Menu>
                      }
                      disabled={!wallet}
                    >
                      <Button>{this.state.type} <Icon type="down" /></Button>
                    </Dropdown>
                  </div>
                  <div className={style.option}>
                    <div className={style.optionTitle}>{intl.formatMessage({ id: 'Status' })}:</div>
                    <Dropdown
                      overlay={
                        <Menu>
                          <Menu.Item key="1" onClick={this.onStatusFilterClick.bind(this, 'All')}>
                            {intl.formatMessage({ id: 'All' })}
                          </Menu.Item>
                          <Menu.Item key="2" onClick={this.onStatusFilterClick.bind(this, 'Confirmed')}>
                            {intl.formatMessage({ id: 'Confirmed' })}
                          </Menu.Item>
                          <Menu.Item key="3" onClick={this.onStatusFilterClick.bind(this, 'Unconfirmed')}>
                            {intl.formatMessage({ id: 'Unconfirmed' })}
                          </Menu.Item>
                          <Menu.Item key="4" onClick={this.onStatusFilterClick.bind(this, 'Requested')}>
                            {intl.formatMessage({ id: 'Requested' })}
                          </Menu.Item>
                          <Menu.Item key="5" onClick={this.onStatusFilterClick.bind(this, 'Verified')}>
                            {intl.formatMessage({ id: 'Verified' })}
                          </Menu.Item>
                          <Menu.Item key="6" onClick={this.onStatusFilterClick.bind(this, 'Approved')}>
                            {intl.formatMessage({ id: 'Approved' })}
                          </Menu.Item>
                          <Menu.Item key="7" onClick={this.onStatusFilterClick.bind(this, 'Processing')}>
                            {intl.formatMessage({ id: 'Processing' })}
                          </Menu.Item>
                          <Menu.Item key="8" onClick={this.onStatusFilterClick.bind(this, 'Completed')}>
                            {intl.formatMessage({ id: 'Completed' })}
                          </Menu.Item>
                          <Menu.Item key="9" onClick={this.onStatusFilterClick.bind(this, 'Error')}>
                            {intl.formatMessage({ id: 'Error' })}
                          </Menu.Item>
                        </Menu>
                      }
                      disabled={!wallet}
                    >
                      <Button>
                        {this.state.status} <Icon type="down" />
                      </Button>
                    </Dropdown>
                  </div>
                </Fragment>
              )}
            </div>
            {this.state.asset === 'BTC' && (
              <Table
                columns={columns}
                dataSource={transaction && transaction
                  .filter(item =>
                    (this.state.asset === 'All' || this.state.asset === item.symbol) && (this.state.status === 'All' || this.state.status.toLowerCase() === item.status) && (this.state.type === 'All' || this.state.type.toLowerCase() === item.category)
                  )
                  .map(item => ({
                    key: item.uuid,
                    date: `${intl.formatDate(new Date(item.createdAt), {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            })}  ${intl.formatTime(new Date(item.createdAt), {
            hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                })}`,
                    asset: item.symbol,
                    type: item.category,
                    status: item.status,
                    address: item.to,
                    amount: intl.formatNumber(item.value, {
                      minimumFractionDigits: 8,
                      maximumFractionDigits: 8
                    })
                  }))}
              />
            )}
            {this.state.asset !== 'BTC' && (
              <Table
                columns={transferColumns}
                dataSource={transferTransaction.map(item => ({
                  key: item.id,
                  id: item.id,
                  block: item.attributes.block_id,
                  asset: item.asset || item.attributes.asset_id,
                  sender: item.attributes.from_account_id,
                  receiver: item.attributes.to_account_id,
                  amount: item.attributes.transfer_balance && intl.formatNumber((item.attributes.transfer_balance / 100000000), { minimumFractionDigits: 0, maximumFractionDigits: 8 }),
                  fee: item.attributes.transfer_fee && intl.formatNumber((item.attributes.transfer_fee / 100000000), { minimumFractionDigits: 0, maximumFractionDigits: 8 }),
                  datetime: `${intl.formatDate(new Date(item.attributes.datetime), {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            })}  ${intl.formatTime(new Date(item.attributes.datetime), {
            hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                })}`,
                }))}
              />
            )}
          </TabPane>
          <TabPane tab={intl.formatMessage({ id: 'My Loan' })} key="3">
            <Table
              columns={loanColumns}
              dataSource={loanTransaction.map(item => ({
                key: item.id,
                id: item.id,
                block: item.attributes.block_id,
                status: item.attributes.status,
                event: item.attributes.event_id,
                balance: item.attributes.loan_balance_total && intl.formatNumber((item.attributes.loan_balance_total / 100000000), { minimumFractionDigits: 0, maximumFractionDigits: 8 }),
                collateral_balance_original: item.attributes.collateral_balance_original && intl.formatNumber((item.attributes.collateral_balance_original / 100000000), { minimumFractionDigits: 0, maximumFractionDigits: 8 }),
                account: item.attributes.account_id,
                datetime: `${intl.formatDate(new Date(item.attributes.datetime), {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}  ${intl.formatTime(new Date(item.attributes.datetime), {
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                })}`
              }))}
            />
          </TabPane>
          <TabPane tab={intl.formatMessage({ id: 'My Stake' })} key="4">
            <Table
              columns={savingColumns}
              dataSource={savingTransaction.map(item => ({
                key: item.id,
                id: item.id,
                block: item.attributes.block_id,
                status: item.attributes.status,
                event: item.attributes.event_id,
                asset: item.asset || item.attributes.asset_id,
                balance: item.attributes.amount && intl.formatNumber((item.attributes.amount / 100000000), { minimumFractionDigits: 0, maximumFractionDigits: 8 }),
                account: item.attributes.account_id && toShortAddress(item.attributes.account_id),
                datetime: `${intl.formatDate(new Date(item.attributes.datetime), {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}  ${intl.formatTime(new Date(item.attributes.datetime), {
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                })}`
              }))}
            />
          </TabPane>
        </Tabs>
      </Card>
    )
  }
}
