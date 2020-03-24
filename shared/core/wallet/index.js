// import uuidv1 from 'uuid/v1'
import assert from 'assert'
import { secureStorage } from 'storage'
import { u8aToHex } from 'utils/u8a'
import { stringToU8a } from 'utils/string'
import {
  createKeystore,
  exportKeystore as exportOfficialKeystore,
  verifyPassword as verifyKeystorePassword,
  decryptKeyPair,
  changeKeystoreNetwork
} from './keystore'

export const scanExtensionWallets = async () => {
  const { web3Accounts, web3Enable } = await import('@polkadot/extension-dapp'/* webpackChunkName: 'extension-dapp' */)

  await web3Enable('definex')
  const allAccounts = await web3Accounts()
  const polkadotExtensionWallets = allAccounts
    .filter(wallet => wallet.meta.source === 'polkadot-js')
    .map(wallet => ({
      id: wallet.address,
      address: wallet.address,
      name: wallet.meta.name,
      chain: 'polkadot',
      source: 'extension',
      network: 'definex',
      timestamp: +Date.now()
    }))

  return polkadotExtensionWallets
}

export const getWallet = async (walletId) => {
  const keystore = await secureStorage.getItem(`wallet_${walletId}`, true)
  assert(keystore, `No keystore for wallet ${walletId}`)

  return {
    id: keystore.id,
    address: keystore.address,
    ...keystore.meta
  }
}

export const scanWallets = async () => {
  const storageKeys = await secureStorage.getAllKeys()
  return Promise.all(storageKeys.filter(key => key.indexOf('wallet_') === 0).map(key => getWallet(key.slice('wallet_'.length))))
}

export const importWallet = async (chain, source, value, password, options = {}) => {
  const keystore = await createKeystore(chain, source, value, password, options)
  await secureStorage.setItem(`wallet_${keystore.id}`, keystore, true)
  return getWallet(keystore.id)
}

export const deleteWallet = async (walletId, password) => {
  const keystore = await secureStorage.getItem(`wallet_${walletId}`, true)
  await verifyKeystorePassword(keystore, password)
  await secureStorage.removeItem(`wallet_${walletId}`)
}

export const exportKeyPair = async (walletId, password) => {
  const keystore = await secureStorage.getItem(`wallet_${walletId}`, true)
  const keyPair = await decryptKeyPair(keystore, password)
  return keyPair
}

export const exportKeystore = async (walletId, password) => {
  const keystore = await secureStorage.getItem(`wallet_${walletId}`, true)
  const officialKeystore = await exportOfficialKeystore(keystore, password)
  return officialKeystore
}

export const verifyPassword = async (walletId, password) => {
  const keystore = await secureStorage.getItem(`wallet_${walletId}`, true)
  await verifyKeystorePassword(keystore, password)
}

export const signData = async (walletId, password, data) => {
  const keystore = await secureStorage.getItem(`wallet_${walletId}`, true)
  const keyPair = await decryptKeyPair(keystore, password)
  const u8aData = stringToU8a(data)
  const signedData = await keyPair.sign(u8aData)
  return u8aToHex(signedData)
}

export const changeWalletName = async (walletId, name) => {
  const keystore = await secureStorage.getItem(`wallet_${walletId}`, true)
  assert(keystore, `No keystore for wallet ${walletId}`)

  keystore.name = name
  await secureStorage.setItem(`wallet_${walletId}`, keystore, true)
  return getWallet(keystore.id)
}

export const changeWalletNetwork = async (walletId, network) => {
  const keystore = await secureStorage.getItem(`wallet_${walletId}`, true)
  assert(keystore, `No keystore for wallet ${walletId}`)

  const newKeystore = await changeKeystoreNetwork(keystore, network)
  await secureStorage.setItem(`wallet_${walletId}`, newKeystore, true)
  return getWallet(newKeystore.id)
}
