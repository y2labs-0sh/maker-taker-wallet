import { createSelector } from 'reselect'
import { initialState } from 'reducers/contact'

const contactAllIdsSelector = state => state.contact.allIds || initialState.allIds
const contactByIdSelector = state => state.contact.byId || initialState.byId
const activeContactIdSelector = state => state.contact.activeId || initialState.activeId

export const contactSelector = createSelector(
  contactAllIdsSelector,
  contactByIdSelector,
  (allIds, byId) => allIds.map(id => byId[id])
)

export const activeContactSelector = createSelector(
  activeContactIdSelector,
  contactByIdSelector,
  (id, byId) => byId[id]
)
