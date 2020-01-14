import React, { Component } from 'react'
import { bindActionCreators } from 'redux-helper'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import * as intlActions from 'actions/intl'
import * as endPointActions from 'actions/endPoint'
import { endPointsSelector, activeEndPointSelector, activeEndPointUrlSelector } from 'selectors/endPoint'
import AddNodeForm from 'components/Form/AddNodeForm'
import { Select, Card, Table, Modal, Button, Icon } from 'antd'
import { CHAIN_API } from 'constants/env'
import style from './style.css'

const { Option } = Select

@injectIntl

@connect(
  state => ({
    locale: state.intl.locale,
    endPoints: endPointsSelector(state),
    activeEndPointUrl: activeEndPointUrlSelector(state),
    activeEndPoint: activeEndPointSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...intlActions,
      ...endPointActions
    }, dispatch)
  })
)

export default class Setting extends Component {
  state = {
    showAddNodeModal: false
  }

  componentDidMount() {
    this.props.actions.getEndPointStatus.requested()
  }

  setLocale = (e) => {
    this.props.actions.setLocale(e)
  }

  setEndPoint = (e) => {
    const { activeEndPointUrl } = this.props
    const newEndPoint = typeof e === 'string' ? e.trim() : ''

    if (newEndPoint !== activeEndPointUrl) {
      this.props.actions.setActiveEndPoint(newEndPoint)
      window.location.reload()
    }
  }

  toggleAddNodeModal = () => {
    this.setState({ showAddNodeModal: !this.state.showAddNodeModal })
  }

  deleteEndPoint = (url) => {
    const { activeEndPointUrl } = this.props

    if (activeEndPointUrl === url) {
      this.props.actions.setActiveEndPoint(CHAIN_API)
    }

    this.props.actions.deleteEndPoint(url)

    if (activeEndPointUrl === url) {
      window.location.reload()
    }
  }

  render() {
    const { endPoints, locale, intl, activeEndPointUrl, activeEndPoint } = this.props

    const columns = [{
      title: intl.formatMessage({ id: 'Name' }),
      dataIndex: 'name',
      key: 'name',
    }, {
      title: intl.formatMessage({ id: 'Node Address' }),
      dataIndex: 'node_address',
      key: 'node_address',
    }, {
      title: intl.formatMessage({ id: 'Network Delay' }),
      dataIndex: 'network_delay',
      key: 'network_delay',
    }, {
      title: intl.formatMessage({ id: 'Block Height' }),
      dataIndex: 'block_height',
      key: 'block_height',
    }, {
      title: intl.formatMessage({ id: 'Action' }),
      key: 'action',
      render: (props) => {
        const { node_address } = props
        if (node_address === CHAIN_API) return null

        return (
          <Button onClick={this.deleteEndPoint.bind(this, node_address)}>delete</Button>
        )
      }
    }]

    return (
      <Card className={style.setting}>
        <div style={{ fontSize: '17px', marginBottom: '20px' }}>{intl.formatMessage({ id: 'Settings' })}</div>
        <div style={{ fontSize: '14px', marginBottom: '12px', fontWeight: 'bold' }}>{intl.formatMessage({ id: 'General' })}</div>
        <div className={style.settingItem}>
          <div className={style.settingLabel}>{intl.formatMessage({ id: 'Language' })} </div>
          <Select defaultValue={locale} style={{ width: 120 }} onChange={this.setLocale}>
            <Option value="zh" key="zh">简体中文</Option>
            <Option value="en" key="en" >English</Option>
          </Select>
        </div>
        <div style={{ fontSize: '14px', marginBottom: '12px', fontWeight: 'bold' }}>{intl.formatMessage({ id: 'Network and Node Management' })}</div>
        <div className={style.settingItem}>
          <div className={style.settingLabel}>{intl.formatMessage({ id: 'Network' })} </div>
          <Select defaultValue={activeEndPoint ? (activeEndPoint.name) : activeEndPointUrl} style={{ width: 120 }}>
            {endPoints.map(item =>
              <Option value={item.url} key={item.url} onClick={this.setEndPoint.bind(this, item.url)}>{item.name}</Option>
            )}
          </Select>
        </div>
        <div className={style.addNode}>
          <Button type="primary" onClick={this.toggleAddNodeModal}>
            <Icon type="plus" /> {intl.formatMessage({ id: 'Add Node' })}
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={endPoints.map(item => ({
            key: item.url,
            name: item.name,
            type: '',
            node_address: item.url,
            network_delay: item.delayTime ? `${item.delayTime} ms` : '--',
            block_height: item.blockNumber || '--',
            sync_status: '',
            connected_peers: '',
            node_in_use: ''
          }))}
          pagination={false}
        />
        {this.state.showAddNodeModal && (
          <Modal
            visible={true}
            title={intl.formatMessage({ id: 'Add Node' })}
            closable
            onCancel={this.toggleAddNodeModal}
            footer={null}
          >
            <AddNodeForm onClose={this.toggleAddNodeModal} />
          </Modal>
        )}
      </Card>
    )
  }
}
