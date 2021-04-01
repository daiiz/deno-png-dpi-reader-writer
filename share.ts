const { Buffer } = Deno

export interface ImageInfo {
  width?: number,
  height?: number,
  dpi?: number
}

export const toDec = (arr: Uint8Array): number => {
  const _toBin = (value: number, bits: number) => value.toString(2).padStart(bits, '0')
  return parseInt(Array.from(arr).map(v => _toBin(v, 8)).join(''), 2)
}

export async function isPng (buf: Deno.Buffer): Promise<boolean> {
  const pngSignature = '137 80 78 71 13 10 26 10'
  const p = new Uint8Array(8); await buf.read(p)
  return p.join(' ').toUpperCase() === pngSignature
}

export async function readIHDR (buf: Deno.Buffer): Promise<ImageInfo> {
  // https://tools.ietf.org/html/rfc2083#page-15
  // Length, ChunkType
  await skip(buf, 4 + 4)
  const width = new Uint8Array(4); await buf.read(width)
  const height = new Uint8Array(4); await buf.read(height)
  // Bit depth, Color type, Compression method, Filter method, nterlace method, CRC
  await skip(buf, 1 + 1 + 1 + 1 + 1 + 4)
  return {
    width: toDec(width),
    height: toDec(height)
  }
}

export function getCharCodes (raw: string): string {
  return raw.split('').map(c => c.charCodeAt(0)).join(' ')
}

export async function skip (buf: Deno.Buffer, bytes: number) {
  const _ = new Uint8Array(bytes);
  await buf.read(_)
}
