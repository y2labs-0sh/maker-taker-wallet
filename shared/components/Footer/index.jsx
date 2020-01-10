import React, { Component } from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import styles from './style.css'

@injectIntl

@connect(
  state => ({
    chainState: state.chain.chainState
  })
)

export default class Footer extends Component {
  render() {
    const { chainState, intl } = this.props
    const blockHeight = chainState.blockHeight
    const blockTime = chainState.blockTime

    return (
      <div className={styles.footer}>
        <div className={styles.info}>{intl.formatMessage({ id: 'Block Height' })}: {blockHeight || '--'}</div>
        <div className={styles.info}>{intl.formatMessage({ id: 'Block Time' })}: {blockTime || '--'} ms</div>
      </div>
    )
  }
}
