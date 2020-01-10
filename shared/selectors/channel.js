import createCachedSelector from 're-reselect'

export const channelSelector = state => state.channel || {}

export const channelSelectorByAddress = createCachedSelector(
  channelSelector,
  (state, address) => address,
  (state, address, type) => type,
  (channels, address, type) => {
    const channelIds = Object.keys(channels)
    return channelIds.filter(id => id.indexOf(address) !== -1 && id.indexOf(`${type}/`) === 0)
  }
)(
  (state, address, type) => `${type}/${address}`
)
