import assert from 'assert'
import uuidv4 from 'uuid/v4'
import * as bip39 from 'bip39'
import { randomBytes } from '../crypto'

export const randomUUID = async (id) => {
  if (id) return id

  const random = await randomBytes(16)
  return uuidv4({ random })
}

export const validatePolkadotKeystore = (keystore) => {
  assert(keystore, 'No keystore')
  assert(keystore.encoding && keystore.encoding.content, 'No keystore encoding')
  assert(keystore.address, 'No keystore address')
  assert(keystore.encoded, 'No keystore encoded')
}

export const validateBip39Mnemonics = (mnemonics) => {
  assert(bip39.validateMnemonic(mnemonics), 'Invalid mnemonics')
}
