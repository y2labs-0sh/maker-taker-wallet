import { randomBytes as randombytes } from 'crypto'

const randomBytes = async (length) => {
  return new Promise((resolve, reject) => {
    randombytes(length, (error, bytes) => {
      if (error) {
        reject(error)
      } else {
        resolve(bytes)
      }
    })
  })
}

export default randomBytes
