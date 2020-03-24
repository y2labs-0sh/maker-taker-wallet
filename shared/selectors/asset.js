// import { createSelector } from 'reselect'
import { initialState } from 'reducers/asset'
// import { activeBalanceSelector } from './balance'

export const activeAssetIdSelector = state => state.asset.activeId || initialState.activeId || 1

// export const assetMapSelector = createSelector(
//   activeBalanceSelector,
//   (balances) => {
//     if (!balances) return {}

//     return balances.map(item => ({ id: item.contract, name: item.symbol }))
//   }
// )
