import { createHash } from 'crypto'
import randomBytes from './randomBytes'
import nacl from './nacl'
import schnorrkel from './schnorrkel'

const ripemd160 = buffer => createHash('rmd160').update(buffer).digest()

const sha1 = buffer => createHash('sha1').update(buffer).digest()

const sha256 = buffer => createHash('sha256').update(buffer).digest()

const hash160 = buffer => ripemd160(sha256(buffer))

const hash256 = buffer => sha256(sha256(buffer))

export {
  randomBytes,
  hash256,
  hash160,
  sha256,
  sha1,
  ripemd160,
  nacl,
  schnorrkel
}
