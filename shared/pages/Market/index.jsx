import React, { Component } from 'react'
import { bindActionCreators } from 'redux-helper'
import { connect } from 'react-redux'
// import { Keyring } from '@polkadot/keyring'
import { injectIntl } from 'react-intl'
import { Card, Table, Button, Modal } from 'antd'
// import { getTransactionExecutor } from 'sagas/wallet'
import * as walletActions from 'actions/wallet'
// import * as chain from 'core/chain'
import * as assetActions from 'actions/asset'
import { activeWalletSelector } from 'selectors/wallet'
import MakeBorrowForm from 'components/Form/MakeBorrowForm'
import AddBorrowForm from 'components/Form/AddBorrowForm'
import RepayBorrowForm from 'components/Form/RepayBorrowForm'
import CancelBorrowForm from 'components/Form/CancelBorrowForm'
import LendBorrowForm from 'components/Form/LendBorrowForm'
import PasswordPrompt from 'components/PasswordPrompt'
import { ApiPromise, WsProvider } from '@polkadot/api'
import chainTypes from '../../core/chain/chainTypes'

// const testKeyring = require('@polkadot/keyring/testing');

@injectIntl

@connect(
  state => ({
    locale: state.intl.locale,
    wallet: activeWalletSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...walletActions,
      ...assetActions
    }, dispatch)
  })
)

export default class Market extends Component {
  state = {
    showAddModal: false,
    showLendModal: false,
    showRepayModal: false,
    showMakeModal: false,
    showCancelModal: false,
    loadingTable: true,
    currentItem: '',
    symbolsMapping: {},
    statusMapping: [
      'Well',
      'ToBeLiquidated',
      'Liquidated',
      'Dead',
      'Completed'
    ],
    api: {},
    // symbolMapping:{},
    bidsArray: []
  }

  hexCharCodeToStr(hexCharCodeStr) {
    const trimedStr = hexCharCodeStr.trim();
    const rawStr = trimedStr.substr(0, 2).toLowerCase() === '0x' ? trimedStr.substr(2) : trimedStr;
    const len = rawStr.length;
    if (len % 2 !== 0) {
      console.log('存在非法字符!');
      return '';
    }
    let curCharCode;
    const resultStr = [];
    for (let i = 0; i < len; i += 2) {
      curCharCode = parseInt(rawStr.substr(i, 2), 16);
      resultStr.push(String.fromCharCode(curCharCode));
    }
    return resultStr.join('');
  }

  componentDidMount() {
    const wsProvider = new WsProvider('wss://node2.definex.io')
    ApiPromise.create({ provider: wsProvider, types: chainTypes }).then(async (api) => {
      console.log('api is', api)
      //query symbols
      const symbolsArray = JSON.parse((await api.query.genericAsset.symbols()).toString())
      const symbolsMapping = {}
      for (let i = 0; i < symbolsArray.length; i++) {
        symbolsMapping[symbolsArray[0][i]] = this.hexCharCodeToStr(symbolsArray[1][i])
      }
      this.setState({
        symbolsMapping: symbolsMapping
      }, () => {
        console.log(this.state.symbolsMapping, 234234)
        this.setState({
          api: api
        }, async () => {
          const bidsArray = await this.state.api.query.lsBiding.borrows()
          this.setState({
            loadingTable: false,
            bidsArray: JSON.parse(bidsArray[1].toString())
          })
        })
      })
    })
  }

  toggleMakeModal = () => {
    this.setState({ showMakeModal: !this.state.showMakeModal })
  }

  toggleAddModal = () => {
    this.setState({ showAddModal: !this.state.showAddModal })
  }

  toggleCancelModal = () => {
    this.setState({ showCancelModal: !this.state.showCancelModal })
  }

  toggleLendModal = () => {
    this.setState({ showLendModal: !this.state.showLendModal })
  }

  toggleRepayModal = () => {
    this.setState({ showRepayModal: !this.state.showRepayModal })
  }

  showAddModal = async (record) => {
    const currentWallet = this.props.wallet.address
    const collateralBalance = await this.state.api.query.genericAsset.freeBalance(record.collateral_asset_id, currentWallet)
    record.collateralBalance = (collateralBalance / (10 ** 8)).toString()
    this.setState({
      currentItem: record
    }, () => {
      this.toggleAddModal()
    })
  }

  showLendModal = async (record) => {
    const currentWallet = this.props.wallet.address
    const borrowBalance = await this.state.api.query.genericAsset.freeBalance(record.borrow_asset_id, currentWallet)
    record.borrowBalance = (borrowBalance / (10 ** 8)).toString()
    this.setState({
      currentItem: record
    }, () => {
      this.toggleLendModal()
    })
  }

  showRepayModal = async (record) => {
    const currentWallet = this.props.wallet.address
    const borrowBalance = await this.state.api.query.genericAsset.freeBalance(record.borrow_asset_id, currentWallet)
    record.borrowBalance = (borrowBalance / (10 ** 8)).toString()
    this.setState({
      currentItem: record
    }, () => {
      this.toggleRepayModal()
    })
  }

  showCancelModal = (record) => {
    this.setState({
      currentItem: record
    }, () => {
      this.toggleCancelModal()
    })
  }

  // submitAdd = async (item) => {
  //   this.setState({
  //     loadingAdd: true,
  //   }, async () => {
  //     console.log(item)
  //     const { api } = this.state
  //     // const sender = await getTransactionExecutor()
  //     // console.log('sender', sender)
  //     // const foo = await chain.add(sender, item.borrowId, item.amount)
  //     // console.log(foo)
  //     const EVE = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';
  //     // const api = await this.getPolkaApiForSender(ALICE);
  //     const keyring = testKeyring.default()
  //     // const keyring = new Keyring();
  //     const evePair = keyring.getPair(EVE)
  //     await api.tx.lsBiding.add(item.borrowId, item.amount).signAndSend(evePair, ({ status }) => {
  //       if (status.isInBlock) {
  //         message.success('In Block')
  //       } else if (status.isFinalized) {
  //         message.success('Is Finalized')
  //         console.log('done')
  //         this.toggleAddModal()
  //       }
  //     })
  //   })
  // }

  // submitLend = async (item) => {
  //   const result = await this.state.api.tx.lsBiding.lend(item.id)
  //   console.log('result', result)
  //   this.toggleLendModal()
  // }

  // submitRepay = async (item) => {
  //   this.setState({
  //     loadingRepay: true
  //   }, async () => {
  //     const { api } = this.state
  //     // const sender = await getTransactionExecutor()
  //     // console.log('sender', sender)
  //     // const foo = await chain.add(sender, item.borrowId, item.amount)
  //     // console.log(foo)
  //     const EVE = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';
  //     // const api = await this.getPolkaApiForSender(ALICE);
  //     const keyring = testKeyring.default()
  //     // const keyring = new Keyring();
  //     const evePair = keyring.getPair(EVE)
  //     await api.tx.lsBiding.repay(item.borrowId).signAndSend(evePair, ({ status }) => {
  //       if (status.isInBlock) {
  //         message.success('In Block')
  //       } else if (status.isFinalized) {
  //         message.success('Is Finalized')
  //         console.log('done')
  //         this.toggleRepayModal()
  //       }
  //     })
  //   })
  // }

  render() {
    const { intl, wallet } = this.props
    const { bidsArray, loadingTable, symbolsMapping } = this.state

    const columns = [{
      title: intl.formatMessage({ id: 'Id' }),
      dataIndex: 'id',
      key: 'id',
    }, {
      title: intl.formatMessage({ id: 'lockId' }),
      dataIndex: 'lock_id',
      key: 'lock_id',
    }, {
      title: intl.formatMessage({ id: 'who' }),
      dataIndex: 'who',
      key: 'who',
    }, {
      title: intl.formatMessage({ id: 'status' }),
      dataIndex: 'status',
      key: 'status',
      render: (props, record) => (
        <span>{this.state.statusMapping[record.status]}</span>
      )
    }, {
      title: intl.formatMessage({ id: 'borrowAssetId' }),
      dataIndex: 'borrow_asset_id',
      key: 'borrow_asset_id',
      render: (props, record) => (
        <span>{this.state.symbolsMapping[record.borrow_asset_id]}</span>
      )
    },
    {
      title: intl.formatMessage({ id: 'collateralAssetId' }),
      dataIndex: 'collateral_asset_id',
      key: 'collateral_asset_id',
      render: (props, record) => (
        <span>{this.state.symbolsMapping[record.collateral_asset_id]}</span>
      )
    },
    {
      title: intl.formatMessage({ id: 'borrowBalance' }),
      dataIndex: 'borrow_balance',
      key: 'borrow_balance',
      render: (props, record) => (
        <span>{record.borrow_balance / (10 ** 8)}</span>
      )
    },
    {
      title: intl.formatMessage({ id: 'collateralBalance' }),
      dataIndex: 'collateral_balance',
      key: 'collateral_balance',
      render: (props, record) => (
        <span>{record.collateral_balance / (10 ** 8)}</span>
      )
    },
    {
      title: intl.formatMessage({ id: 'terms' }),
      dataIndex: 'terms',
      key: 'terms',
    },
    {
      title: intl.formatMessage({ id: 'interestRate' }),
      dataIndex: 'interest_rate',
      key: 'interest_rate',
    },
    {
      title: intl.formatMessage({ id: 'deadAfter' }),
      dataIndex: 'dead_after',
      key: 'dead_after',
    },
    {
      title: intl.formatMessage({ id: 'loanId' }),
      dataIndex: 'loan_id',
      key: 'loan_id',
    },
    {
      title: intl.formatMessage({ id: 'Action' }),
      key: 'action',
      render: (props, record) => {
        return (
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {wallet.address === record.who && (
              <div style={{ paddingRight: '10px' }}>
                <Button onClick={this.showAddModal.bind(this, record)}>{intl.formatMessage({ id: 'add' })}</Button>
              </div>
            )}
            <div style={{ paddingRight: '10px' }}>
              <Button onClick={this.showLendModal.bind(this, record)}>{intl.formatMessage({ id: 'lend' })}</Button>
            </div>
            <div style={{ paddingRight: '10px' }}>
              <Button onClick={this.showRepayModal.bind(this, record)}>{intl.formatMessage({ id: 'repay' })}</Button>
            </div>
            <div style={{ paddingRight: '10px' }}>
              <Button onClick={this.showCancelModal.bind(this, record)}>{intl.formatMessage({ id: 'cancel' })}</Button>
            </div>
          </div>
        )
      }
    }]

    return (
      <Card>
        <Button type="primary" onClick={this.toggleMakeModal.bind(this)}>{intl.formatMessage({ id: 'make' })}</Button>
        <Table
          columns={columns}
          dataSource={bidsArray}
          rowKey="id"
          loading={loadingTable}
          scroll={{ x: true }}
          pagination={false}
          style={{ marginBottom: '40px' }}
        />
        {this.state.showMakeModal && (
          <Modal
            visible={true}
            title={intl.formatMessage({ id: 'make' })}
            closable
            onCancel={this.toggleMakeModal}
            footer={null}
          >
            <MakeBorrowForm api={this.state.api} symbolsMapping={symbolsMapping} address={wallet.address} />
          </Modal>
        )}
        {this.state.showAddModal && (
          <Modal
            visible={true}
            title={intl.formatMessage({ id: 'add' })}
            closable
            onCancel={this.toggleAddModal}
            footer={null}
          >
            <AddBorrowForm item={this.state.currentItem} symbolsMapping={symbolsMapping} />
          </Modal>
        )}
        {this.state.showLendModal && (
          <Modal
            visible={true}
            title={intl.formatMessage({ id: 'lend' })}
            closable
            onCancel={this.toggleLendModal}
            footer={null}
          >
            <LendBorrowForm item={this.state.currentItem} symbolsMapping={symbolsMapping} />
          </Modal>
        )}
        {this.state.showRepayModal && (
          <Modal
            visible={true}
            title={intl.formatMessage({ id: 'repay' })}
            closable
            onCancel={this.toggleRepayModal}
            footer={null}
          >
            <RepayBorrowForm item={this.state.currentItem} symbolsMapping={symbolsMapping} />
          </Modal>
        )}
        {this.state.showCancelModal && (
          <Modal
            visible={true}
            title={intl.formatMessage({ id: 'cancel' })}
            closable
            onCancel={this.toggleCancelModal}
            footer={null}
          >
            <CancelBorrowForm item={this.state.currentItem} />
          </Modal>
        )}
        <PasswordPrompt />
      </Card>
    )
  }
}
