import assert from 'assert'
import deepEqual from 'fast-deep-equal'
import BTCIcon from 'resources/images/btc.png'
import RBTCIcon from 'resources/images/rbtc.png'
import RIOIcon from 'resources/images/rio.png'
import RIOTIcon from 'resources/images/riot.png'
import RSCIcon from 'resources/images/rsc.png'

export const getIcon = (asset) => {
  switch (asset) {
    case 'BTC':
      return BTCIcon
    case 'RIO':
      return RIOIcon
    case 'RIOT':
      return RIOTIcon
    case 'RBTC':
      return RBTCIcon
    default:
      if (asset.indexOf('RS P') !== -1) {
        return RSCIcon
      }

      return null
  }
}

export const equal = deepEqual

export const errorLoading = err => console.error('Dynamic page loading failed: ', err)

export const getChannelId = (namespace, id) => {
  assert(namespace, 'invalid namespace')
  assert(id, 'invalid id')

  return `${namespace}/${id}`
}

export const getWalletUniqueInfo = (wallet) => {
  assert(wallet.chain, 'can not found chain type for wallet')
  assert(wallet.address, 'can not found address type for wallet')

  const chain = wallet.chain
  const address = wallet.address

  return {
    id: `${chain}/${address}`,
    chain,
    address
  }
}

export const getAssetUniqueInfo = (wallet, asset) => {
  assert(wallet.chain, 'can not found chain type for wallet')
  assert(wallet.address, 'can not found address type for wallet')

  const chain = wallet.chain
  const address = wallet.address

  if (!asset) {
    return {
      id: `${chain}/${address}/SYSCOIN/RIO`,
      chain,
      address,
      contract: 'SYSCOIN',
      symbol: 'RIO'
    }
  }

  assert(asset.symbol, 'can not found symbol type for wallet')

  const contract = asset.contract || asset.assetId || 'SYSCOIN'
  const symbol = asset.symbol

  return {
    id: `${chain}/${address}/${contract}/${symbol}`,
    chain,
    address,
    contract,
    symbol
  }
}

export const toShortAddress = (address) => {
  if (address && typeof address === 'string' && address.length > 16) {
    return `${address.slice(0, 8)}...${address.slice(-8)}`
  }

  return address
}

export const readFileAsText = (file) => {
  return new Promise((reslove) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      reslove(e.target.result)
    }

    reader.readAsText(file)
  })
}

export const readFileAsJson = async (file) => {
  const text = await readFileAsText(file)
  return JSON.parse(text)
}

export const exportFileAsJson = (address, keystore) => {
  const filename = `${address}.json`
  const contentType = 'application/json;charset=utf-8;'
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    const blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(keystore)))], { type: contentType })
    navigator.msSaveOrOpenBlob(blob, filename)
  } else {
    const a = document.createElement('a')
    a.download = filename
    a.href = `data:${contentType},${encodeURIComponent(JSON.stringify(keystore))}`
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
}
