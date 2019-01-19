import {Buffer} from 'deno'
import {toDec, isPng, readIHDR, readBytes, getCharCodes} from './share.ts'

export async function parsePngFormat (buf: Buffer) {
  // const ptr = {pos: 0}
  // const byteArray = new Uint8Array(arrayBuffer.buf)
  // await isPng(buf)
  // return await readIHDR(buf)
  return readChunks(buf)
}

const readpHYs = async (buf: Buffer): Promise<number> => {
  let p
  // https://tools.ietf.org/html/rfc2083#page-22
  p = new Uint8Array(4); await buf.read(p)
  const pixelsPerUnitXAxis = toDec(p)
    //parseInt(readBytes(byteArray, ptr, 4).map(v => toBin(v, 8)).join(''), 2)
  p = new Uint8Array(4); await buf.read(p)
  const pixelsPerUnitYAxis = toDec(p)
  // const pixelsPerUnitYAxis = parseInt(readBytes(byteArray, ptr, 4).map(v => toBin(v, 8)).join(''), 2)
  p = new Uint8Array(1); await buf.read(p)
  const unitSpecifier = p[0]
    //readBytes(byteArray, ptr, 1).pop()
  let dpi = 72
  if (unitSpecifier === 1) {
    // calculate dots per inch
    dpi = Math.floor(Math.max(pixelsPerUnitXAxis, pixelsPerUnitYAxis) / (unitSpecifier * 39.3))
  }
  return dpi
}

const readChunks = async (buf: Buffer) => {
  if (!await isPng(buf)) {
    return {
      width: undefined,
      height: undefined,
      dpi: undefined
    }
  }
  const {width, height} = await readIHDR(buf)
  let dpi
  while (true) {
    if (buf.empty()) break
    let p

    p = new Uint8Array(4); await buf.read(p)
    const chunkLength = toDec(p)
    // const _chunkLength = readBytes(byteArray, ptr, 4).map(v => toBin(v, 8))
    // const chunkLength = parseInt(_chunkLength.join(''), 2)
    p = new Uint8Array(4); await buf.read(p)
    const chunkType = p.join(' ')
    // const chunkType = readBytes(byteArray, ptr, 4).join(' ')
    if (chunkType === getCharCodes('IDAT') || chunkType === getCharCodes('IEND')) break
    switch (chunkType) {
      case getCharCodes('pHYs'):
        dpi = await readpHYs(buf)
        break
      default:
        p = new Uint8Array(chunkLength); await buf.read(p)
        // ptr.pos += chunkLength
    }
    // CRC
    p = new Uint8Array(4); await buf.read(p)
    // ptr.pos += 4 // CRC
  }
  return {width, height, dpi}
}
