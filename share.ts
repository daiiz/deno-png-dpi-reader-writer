export const toBin = (value, digits): string => {
  return value.toString(2).padStart(digits, '0')
}

export const toHex = (value, digits): string => {
  return value.toString(16).padStart(digits, '0')
}

export function isPng (byteArray, ptr): boolean {
  const pngSignature = '89 50 4E 47 0D 0A 1A 0A'
  const signature = readBytes(byteArray, ptr, 8).map(v => toHex(v, 2))
  return signature.join(' ').toUpperCase() === pngSignature
}

export function readBytes (byteArray, ptr, byteLength): Array<number> {
  const {pos} = ptr
  const res = byteArray.slice(pos, pos + byteLength)
  ptr.pos += byteLength
  return Array.from(res)
}

export function readIHDR (byteArray, ptr) {
  // https://tools.ietf.org/html/rfc2083#page-15
  // Length, ChunkType
  ptr.pos += (4 + 4)
  const _width = readBytes(byteArray, ptr, 4).map(v => toBin(v, 8))
  const width = parseInt(_width.join(''), 2)
  const _height = readBytes(byteArray, ptr, 4).map(v => toBin(v, 8))
  const height = parseInt(_height.join(''), 2)
  // Bit depth, Color type, Compression method, Filter method, nterlace method, CRC
  ptr.pos += (1 + 1 + 1 + 1 + 1 + 4)
  return {width, height}
}

export function getCharCodes (str) {
  return str.split('').map(c => c.charCodeAt(0)).join(' ')
}
