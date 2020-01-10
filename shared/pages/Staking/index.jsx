import React, { Component } from 'react'
import { bindActionCreators } from 'redux-helper'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { Card, Tabs } from 'antd'
import * as actions from 'actions/stake'
import { activeTransactionSelector } from 'selectors/transaction'
import { activeWalletSelector } from 'selectors/wallet'
import StakeForm from 'components/Form/StakeForm'
import UnstakeForm from 'components/Form/UnstakeForm'
// import { toShortAddress } from 'utils'
// import style from './style.css'

const { TabPane } = Tabs

@injectIntl

@connect(
  state => ({
    wallet: activeWalletSelector(state),
    transaction: activeTransactionSelector(state)
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch)
  })
)

export default class Staking extends Component {
  componentDidMount() {
    this.props.actions.getSBTCAssetId.requested()
    this.props.actions.getRBTCAssetId.requested()
    this.props.actions.getSavingAccountId.requested()
    this.props.actions.getCurrentPhaseId.requested()
    this.props.actions.getPhaseList.requested()
    this.props.actions.getUsedQuota.requested()
  }

  render() {
    const { intl } = this.props

    return (
      <Card style={{ overflow: 'scroll' }}>
        <Tabs defaultActiveKey="1" type="card">
          <TabPane tab={intl.formatMessage({ id: 'Save' })} key="1">
            <StakeForm />
          </TabPane>
          <TabPane tab={intl.formatMessage({ id: 'Redeem' })} key="2">
            <UnstakeForm />
          </TabPane>
        </Tabs>
      </Card>
    )
  }
}
