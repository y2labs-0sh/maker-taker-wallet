import {
  createPolkadotKeystoreBySuri,
  createPolkadotKeystoreByKeystore,
  exportPolkadotKeystore,
  verifyPolkadotPassword,
  exportPolkadotKeyPair,
  changePolkadotNetwork
} from './polkadot'
// import { nacl, schnorrkel } from '../crypto'

export const createPolkadotKeystore = async (source, value, password, options) => {
  switch (source) {
    case 'suri':
      return createPolkadotKeystoreBySuri(value, password, options)
    case 'keystore':
      return createPolkadotKeystoreByKeystore(value, password, options)
    default:
      throw new Error(`unsupported source type ${source}`)
  }
}

export const createKeystore = async (chain, source, value, password, options) => {
  switch (chain) {
    case 'polkadot':
      return createPolkadotKeystore(source, value, password, options)
    default:
      throw new Error(`unsupported chain type ${chain}`)
  }
}

export const exportKeystore = async (keystore, password) => {
  const chain = keystore.meta.chain

  switch (chain) {
    case 'polkadot':
      return exportPolkadotKeystore(keystore, password)
    default:
      throw new Error(`unsupported chain type ${chain}`)
  }
}

export const decryptKeyPair = async (keystore, password) => {
  const chain = keystore.meta.chain

  switch (chain) {
    case 'polkadot':
      return exportPolkadotKeyPair(keystore, password)
    default:
      throw new Error(`unsupported chain type ${chain}`)
  }
}

export const verifyPassword = async (keystore, password) => {
  const chain = keystore.meta.chain

  switch (chain) {
    case 'polkadot':
      return verifyPolkadotPassword(keystore, password)
    default:
      throw new Error(`unsupported chain type ${chain}`)
  }
}

/* export const signData = async (message, privateKey, options) => {
 *   const { keyPairType } = options
 *
 *   switch (keyPairType) {
 *     case 'sr25519': {
 *       return schnorrkel.sign(new Uint8Array(Buffer.from(message)), privateKey)
 *     }
 *     case 'ed25519': {
 *       return nacl.sign(new Uint8Array(Buffer.from(message)), privateKey)
 *     }
 *     default:
 *       throw new Error(`unsupported key pair crypto type ${keyPairType}`)
 *   }
 * } */

export const changeKeystoreNetwork = async (keystore, network) => {
  const chain = keystore.meta.chain

  switch (chain) {
    case 'polkadot':
      return changePolkadotNetwork(keystore, network)
    default:
      throw new Error(`unsupported chain type ${chain}`)
  }
}
