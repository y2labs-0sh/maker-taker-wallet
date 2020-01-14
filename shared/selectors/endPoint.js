import { createSelector } from 'reselect'
import { initialState } from 'reducers/endPoint'

export const endPointAllIdsSelector = state => state.endPoint.allIds || initialState.allIds
export const endPointByIdSelector = state => state.endPoint.byId || initialState.byId
export const endPointBuildInAllIdsSelector = state => state.endPoint.buildInAllIds || initialState.buildInAllIds
export const endPointBuildInByIdSelector = state => state.endPoint.buildInById || initialState.buildInById
export const activeEndPointUrlSelector = state => state.endPoint.active || initialState.active

export const endPointsSelector = createSelector(
  endPointAllIdsSelector,
  endPointByIdSelector,
  endPointBuildInAllIdsSelector,
  endPointBuildInByIdSelector,
  (allIds, byId, buildInAllIds, buildInById) => {
    let list = []
    if (allIds && byId) {
      list = allIds.map(id => byId[id])
    }

    let buildInList = []
    if (buildInAllIds && buildInById) {
      buildInList = buildInAllIds.map(id => buildInById[id])
    }

    return buildInList.concat(list).filter(item => !!item)
  }
)

export const activeEndPointSelector = createSelector(
  activeEndPointUrlSelector,
  endPointByIdSelector,
  endPointBuildInByIdSelector,
  (active, byId, buildInById) => {
    if (!active || !byId || !buildInById) return null
    return byId[active] || buildInById[active]
  }
)
