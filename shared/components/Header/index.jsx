import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux-helper'
import { injectIntl } from 'react-intl'
import Logo from 'resources/images/logo.png'
import { Menu, Icon, Modal, Layout, Dropdown, message, Button } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import CreateWalletForm from 'components/Form/CreateWalletForm'
import ImportWalletForm from 'components/Form/ImportWalletForm'
import { allWalletsSelector, activeWalletSelector } from 'selectors/wallet'
// import { btcPriceSelector } from 'selectors/loan'
import { setActiveWallet, exportPolkadotKeystore, deletePolkadotWallet } from 'actions/wallet'
import PasswordPrompt from 'components/PasswordPrompt'
import copy from 'copy-to-clipboard'
import styles from './style.css'

@withRouter

@injectIntl

@connect(
  state => ({
    activeWallet: activeWalletSelector(state),
    wallets: allWalletsSelector(state),
    // btcPrice: btcPriceSelector(state),
    exportPolkadotKeystore: state.asyncRoutine.exportPolkadotKeystore || {},
    deletePolkadotWallet: state.asyncRoutine.deletePolkadotWallet || {}
  }),
  dispatch => ({
    actions: bindActionCreators({
      setActiveWallet,
      exportPolkadotKeystore,
      deletePolkadotWallet
    }, dispatch)
  })
)

export default class Header extends Component {
  static getDerivedStateFromProps(props) {
    const { location } = props
    const { pathname } = location
    const activePath = pathname.replace(/^(\/)+/, '')
    return { activePath }
  }

  state = {
    showCreateModal: false,
    showImportModal: false,
    showManageModal: false,
    activePath: null,
    managingWalletId: null
  }

  toggleCreate = () => {
    this.setState({ showCreateModal: !this.state.showCreateModal })
  }

  toggleImport = () => {
    this.setState({ showImportModal: !this.state.showImportModal })
  }

  toggleManage = (e, walletId) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()

    this.setState({ showManageModal: !this.state.showManageModal, managingWalletId: walletId })
  }

  switchWallet = (id) => {
    this.props.actions.setActiveWallet(id)
  }

  copyAddress = (e, address) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()

    copy(address)
    message.success('address copied')
  }

  deleteWallet = () => {
    if (this.state.managingWalletId) {
      this.props.actions.deletePolkadotWallet.requested({
        walletId: this.state.managingWalletId,
        onSuccess: this.onDeleteSuccess,
        onError: this.onDeleteError,
      })
    }
  }

  exportKeystore = () => {
    if (this.state.managingWalletId) {
      this.props.actions.exportPolkadotKeystore.requested({
        walletId: this.state.managingWalletId,
        onSuccess: this.onExportSuccess,
        onError: this.onExportError
      })
    }
  }

  onDeleteSuccess = () => {
    message.success('delete success')
    this.setState({ showManageModal: false })
  }

  onDeleteError = (error) => {
    message.error(error)
  }

  onExportSuccess = () => {
    message.success('export success')
    this.setState({ showManageModal: false })
  }

  onExportError = (error) => {
    message.error(error)
  }

  render() {
    const { wallets, activeWallet, intl, exportPolkadotKeystore, deletePolkadotWallet } = this.props

    const hasWallet = wallets.length > 0
    const activeAddress = activeWallet && activeWallet.address
    // const price = btcPrice ? intl.formatNumber(btcPrice, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '--'
    const deleting = deletePolkadotWallet.requesting
    const exporting = exportPolkadotKeystore.requesting

    const menu = (
      <Menu selectable={false} selectedKeys={[activeAddress]}>
        <Menu.Item style={{ padding: 0, height: '40px', minWidth: '240px' }} disabled>
          <div className={styles.manage}>
            <a className={styles.create} onClick={this.toggleCreate}>
              <Icon type="plus" style={{ marginRight: '10px' }} /> {intl.formatMessage({ id: 'Create' })}
            </a>
            <a className={styles.import} onClick={this.toggleImport}>
              <Icon type="download" style={{ marginRight: '10px' }} /> {intl.formatMessage({ id: 'Import' })}
            </a>
          </div>
        </Menu.Item>
        <Menu.Divider />
        {!hasWallet && (
          <Menu.Item disabled>
            Create or Import your account to get started
          </Menu.Item>
        )}
        {!!hasWallet && wallets.map(wallet => (
          <Menu.Item key={wallet.address} onClick={this.switchWallet.bind(this, wallet.id)}>
            <div className={styles.wallet}>
              <div className={styles.walletName}>
                <div>{wallet.name} {wallet.source === 'extension' && <span>({intl.formatMessage({ id: 'extension' })})</span>}</div>
                {wallet.source !== 'extension' && <a className={styles.more} onClick={e => this.toggleManage(e, wallet.id)} disabled={wallet.source === 'extension'}><Icon type="more" /></a>}
              </div>
              <div className={styles.walletAddress}>
                <div className={styles.fullAddress}>{wallet.address}</div>
                <a onClick={e => this.copyAddress(e, wallet.address)}><Icon type="copy" /></a>
              </div>
            </div>
          </Menu.Item>
        ))}
      </Menu>
    )

    return (
      <Layout.Header className={styles.header}>
        <Link className={styles.branding} to="/">
          <img src={Logo} alt="logo" />
        </Link>
        <Menu mode="horizontal" className={styles.leftMenu} selectedKeys={[this.state.activePath]} style={{ background: 'black' }}>
          <Menu.Item key="asset">
            <Link to="asset" style={{ color: 'white' }}>
              {intl.formatMessage({ id: 'Asset' })}
            </Link>
          </Menu.Item>
          {/* <Menu.Item key="loan">
            <Link to="loan" style={{ color: 'white' }}>
              {intl.formatMessage({ id: 'Loan' })}
            </Link>
          </Menu.Item>
          <Menu.Item key="saving">
            <Link to="saving" style={{ color: 'white' }}>
              {intl.formatMessage({ id: 'Saving' })}
            </Link>
          </Menu.Item>
          <Menu.Item key="transaction">
            <Link to="transaction" style={{ color: 'white' }}>
              {intl.formatMessage({ id: 'Transactions' })}
            </Link>
          </Menu.Item> */}
          {/* <Menu.Item key="market">
            <Link to="market" style={{ color: 'white' }}>
              {intl.formatMessage({ id: 'Market' })}
            </Link>
          </Menu.Item> */}
        </Menu>
        <div className={styles.rightMenu}>
          {/* <div className={styles.price}>BTC Price: ${price}</div> */}
          <Dropdown overlay={menu} placement="bottomLeft" style={{ height: '50px' }}>
            <a className={styles.profileMenu}>
              <div className={styles.avatar}>
                <Icon type="user" />
              </div>
            </a>
          </Dropdown>
          <Menu mode="horizontal" selectedKeys={[this.state.activePath]} style={{ background: 'black' }}>
            {/* <Menu.Item key="notification">
                <Icon type="notification" />
                </Menu.Item> */}
            <Menu.Item key="setting">
              <Link to="setting" style={{ color: 'white' }}>
                <Icon type="setting" />
              </Link>
            </Menu.Item>
          </Menu>
        </div>
        {this.state.showCreateModal && (
          <Modal
            visible={true}
            title={intl.formatMessage({ id: 'Create Account' })}
            closable
            onCancel={this.toggleCreate}
            footer={null}
          >
            <CreateWalletForm toggleCreate={this.toggleCreate} />
          </Modal>
        )}
        {this.state.showImportModal && (
          <Modal
            visible={true}
            title={intl.formatMessage({ id: 'Import Account' })}
            closable
            onCancel={this.toggleImport}
            footer={null}
          >
            <ImportWalletForm toggleImport={this.toggleImport} />
          </Modal>
        )}
        {this.state.showManageModal && (
          <Modal
            visible={true}
            title={intl.formatMessage({ id: 'Mange Account' })}
            closable
            onCancel={e => this.toggleManage(e, null)}
            footer={null}
          >
            <div className={styles.manageModal}>
              <Button type="primary" className={styles.manageButton} onClick={this.exportKeystore} loading={exporting}>{intl.formatMessage({ id: 'Export Keystore'
              })}</Button>
              <Button type="danger" className={styles.manageButton} onClick={this.deleteWallet} loading={deleting}>{intl.formatMessage({ id: 'Delete' })}</Button>
            </div>
          </Modal>
        )}
        <PasswordPrompt />
      </Layout.Header>
    )
  }
}
