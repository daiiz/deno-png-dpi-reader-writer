import {isPng, toDec, readIHDR, getCharCodes, ImageInfo} from './share.ts'
const { Buffer } = Deno

export async function parsePngFormat(buf: Deno.Buffer): Promise<ImageInfo> {
  return readChunks(buf)
}

const readpHYs = async (buf: Deno.Buffer): Promise<number> => {
  let p
  // https://tools.ietf.org/html/rfc2083#page-22
  p = new Uint8Array(4); await buf.read(p)
  const pixelsPerUnitXAxis = toDec(p)
  p = new Uint8Array(4); await buf.read(p)
  const pixelsPerUnitYAxis = toDec(p)
  p = new Uint8Array(1); await buf.read(p)
  const unitSpecifier = p[0]

  let dpi = 72
  if (unitSpecifier === 1) {
    // calculate dots per inch
    dpi = Math.floor(Math.max(pixelsPerUnitXAxis, pixelsPerUnitYAxis) / (unitSpecifier * 39.3))
  }
  return dpi
}

const readChunks = async (buf: Deno.Buffer): Promise<ImageInfo> => {
  let info: ImageInfo = {}
  if (!await isPng(buf)) return info
  const {width, height} = await readIHDR(buf)
  info.width = width
  info.height = height

  while (true) {
    if (buf.empty()) break
    let p

    p = new Uint8Array(4); await buf.read(p)
    const chunkLength = toDec(p)
    p = new Uint8Array(4); await buf.read(p)
    const chunkType = p.join(' ')

    if (chunkType === getCharCodes('IDAT') || chunkType === getCharCodes('IEND')) break
    switch (chunkType) {
      case getCharCodes('pHYs'):
        info.dpi = await readpHYs(buf)
        break
      default:
        p = new Uint8Array(chunkLength); await buf.read(p)
    }
    // CRC
    p = new Uint8Array(4); await buf.read(p)
  }
  return info
}
