export interface ImageInfo {
  width?: number,
  height?: number,
  dpi?: number
}

export interface PositionRef {
  pos: number
}

const toHex = (value: number, digits: number) => value.toString(16).padStart(digits, '0')

export const toBin = (value: number, digits: number) => value.toString(2).padStart(digits, '0')

export const toDec = (arr: Uint8Array): number => {
  return parseInt(Array.from(arr).map(v => toBin(v, 8)).join(''), 2)
}

export function getCharCodes (raw: string): string {
  return raw.split('').map(c => c.charCodeAt(0)).join(' ')
}

export function isPng (byteArray: Uint8Array, ptr: PositionRef) {
  const pngSignature = '89 50 4E 47 0D 0A 1A 0A'
  const signature = readBytes(byteArray, ptr, 8).map(v => toHex(v, 2))
  return signature.join(' ').toUpperCase() === pngSignature
}

export function readBytes (byteArray: Uint8Array, ptr: PositionRef, byteLength: number) {
  const { pos } = ptr
  const res = byteArray.slice(pos, pos + byteLength)
  ptr.pos += byteLength
  return Array.from(res)
}

export function readIHDR (byteArray: Uint8Array, ptr: PositionRef) {
  // https://tools.ietf.org/html/rfc2083#page-15
  // Length, ChunkType
  ptr.pos += (4 + 4)
  const w = readBytes(byteArray, ptr, 4).map(v => toBin(v, 8))
  const width = parseInt(w.join(''), 2)
  const h = readBytes(byteArray, ptr, 4).map(v => toBin(v, 8))
  const height = parseInt(h.join(''), 2)
  // Bit depth, Color type, Compression method, Filter method, nterlace method, CRC
  ptr.pos += (1 + 1 + 1 + 1 + 1 + 4)
  return {width, height}
}
