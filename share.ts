import {Buffer} from 'deno'

export const toDec = (arr: Uint8Array): number => {
  const _toBin = (value, bits) => {
    return value.toString(2).padStart(bits, '0')
  }
  return parseInt(Array.from(arr).map(v => _toBin(v, 8)).join(''), 2)
}

// export const toHex = (value, digits) => {
//   console.log(value)
//   return value.toString(16).padStart(digits, '0')
// }

export async function isPng (buf: Buffer): Promise<boolean> {
  const pngSignature = '137 80 78 71 13 10 26 10'
  const p = new Uint8Array(8); await buf.read(p)
  return p.join(' ').toUpperCase() === pngSignature
}

export function readBytes (byteArray, ptr, byteLength): Array<number> {
  const {pos} = ptr
  const res = byteArray.slice(pos, pos + byteLength)
  ptr.pos += byteLength
  return Array.from(res)
}

export async function readIHDR(buf) {
  let _
  // https://tools.ietf.org/html/rfc2083#page-15
  // Length, ChunkType
  _ = new Uint8Array(4 + 4); await buf.read(_)
  const width = new Uint8Array(4); await buf.read(width)
  const height = new Uint8Array(4); await buf.read(height)
  // Bit depth, Color type, Compression method, Filter method, nterlace method, CRC
  _ = new Uint8Array(1 + 1 + 1 + 1 + 1 + 4); await buf.read(_)
  return {
    width: toDec(width),
    height: toDec(height)
  }
}

export function getCharCodes (raw: string): string {
  return raw.split('').map(c => c.charCodeAt(0)).join(' ')
}
