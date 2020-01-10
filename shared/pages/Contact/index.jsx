import React, { Component } from 'react'
import { bindActionCreators } from 'redux-helper'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { Table, Card, Button, Modal } from 'antd'
import { contactSelector } from 'selectors/contact'
import ContactForm from 'components/Form/ContactForm'
import * as actions from 'actions/contact'

@injectIntl

@connect(
  state => ({
    contacts: contactSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch)
  })
)

export default class Contact extends Component {
  state = {
    showEditModal: false,
    showDeleteModal: false
  }

  toggleEditModal = (id) => {
    if (id) this.props.actions.setActiveContact(id)
    this.setState({ showEditModal: !this.state.showEditModal })
  }

  toggleDeleteModal = () => {
    this.setState({ showDeleteModal: !this.state.showDeleteModal })
  }

  deleteContact = (id) => {
    this.props.actions.deleteContact(id)
  }

  render() {
    const { contacts, intl } = this.props

    const columns = [{
      title: intl.formatMessage({ id: 'Name' }),
      dataIndex: 'name',
      key: 'name',
    }, {
      title: intl.formatMessage({ id: 'Chain' }),
      dataIndex: 'chain',
      key: 'chain',
    }, {
      title: intl.formatMessage({ id: 'Address' }),
      dataIndex: 'address',
      key: 'address',
    }, {
      title: intl.formatMessage({ id: 'Action' }),
      key: 'action',
      render: (props) => {
        const { key } = props

        return (
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {/* <div style={{ paddingRight: '10px' }}>
                <Button onClick={this.toggleEditModal.bind(this, key)}>{intl.formatMessage({ id: 'Edit' })}</Button>
                </div> */}
            <div style={{ paddingRight: '10px' }}>
              <Button onClick={this.deleteContact.bind(this, key)}>{intl.formatMessage({ id: 'Delete' })}</Button>
            </div>
          </div>
        )
      }
    }]

    return (
      <Card style={{ overflow: 'scroll' }}>
        <div style={{ fontSize: '17px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {intl.formatMessage({ id: 'Contact' })}
          <Button type="primary" onClick={this.toggleEditModal}>{intl.formatMessage({ id: 'Add Contact' })}</Button>
        </div>
        <Table
          columns={columns}
          dataSource={contacts.map(item => ({
            key: item.id,
            name: item.name,
            chain: item.chain,
            address: item.address
          }))}
        />
        {this.state.showEditModal && (
          <Modal
            visible={true}
            title={intl.formatMessage({ id: 'Contact' })}
            closable
            onCancel={() => this.toggleEditModal()}
            footer={null}
          >
            <ContactForm onClose={this.toggleEditModal} />
          </Modal>
        )}
      </Card>
    )
  }
}
