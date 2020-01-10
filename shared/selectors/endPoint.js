import { createSelector } from 'reselect'
import { initialState } from 'reducers/endPoint'

export const endPointAllIdsSelector = state => state.endPoint.allIds || initialState.allIds
export const endPointByIdSelector = state => state.endPoint.byId || initialState.byId
export const activeEndPointUrlSelector = state => state.endPoint.active || initialState.active

export const endPointsSelector = createSelector(
  endPointAllIdsSelector,
  endPointByIdSelector,
  (allIds, byId) => {
    if (!allIds || !byId) return []
    return allIds.map(id => byId[id])
  }
)

export const activeEndPointSelector = createSelector(
  activeEndPointUrlSelector,
  endPointByIdSelector,
  (active, byId) => {
    if (!active || !byId) return null
    return byId[active]
  }
)
