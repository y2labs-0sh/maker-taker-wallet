import { handleActions } from 'redux-helper'
import { getInitialLang } from 'selectors/intl'
import * as actions from 'actions/intl'

export default handleActions({
  [actions.setLocale] (state, action) {
    state.locale = action.payload
  }
}, getInitialLang())
