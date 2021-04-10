// ref: https://github.com/daiiz/png-dpi-reader-writer/blob/master/src/reader.js

import {
  ImageInfo, PositionRef,
  toBin, isPng, readIHDR, readBytes, getCharCodes
} from './share_.ts'

export async function parsePngFormat(byteArray: Uint8Array): Promise<ImageInfo> {
  const ptr: PositionRef = { pos: 0 }
  return readChunks(byteArray, ptr)
}

const readpHYs = (byteArray: Uint8Array, ptr: PositionRef): number => {
  // https://tools.ietf.org/html/rfc2083#page-22
  const pixelsPerUnitXAxis = parseInt(
    readBytes(byteArray, ptr, 4).map(v => toBin(v, 8)).join(''), 2)
  const pixelsPerUnitYAxis = parseInt(
    readBytes(byteArray, ptr, 4).map(v => toBin(v, 8)).join(''), 2)
  const unitSpecifier = readBytes(byteArray, ptr, 1).pop()
  let dpi = 72
  if (unitSpecifier === 1) {
    // dots per inch を計算する
    dpi = Math.floor(Math.max(pixelsPerUnitXAxis, pixelsPerUnitYAxis) / (unitSpecifier * 39.3))
  }
  return dpi
}

const readChunks = (byteArray: Uint8Array, ptr: PositionRef): ImageInfo => {
  const info: ImageInfo = {}
  if (!isPng(byteArray, ptr)) return info

  const { width, height } = readIHDR(byteArray, ptr)
  info.width = width
  info.height = height

  while (true) {
    if (ptr.pos >= byteArray.length) break

    const len = readBytes(byteArray, ptr, 4).map(v => toBin(v, 8))
    const chunkLength = parseInt(len.join(''), 2)

    const chunkType = readBytes(byteArray, ptr, 4).join(' ')
    if (chunkType === getCharCodes('IDAT') || chunkType === getCharCodes('IEND')) break
    switch (chunkType) {
      case getCharCodes('pHYs'):
        info.dpi = readpHYs(byteArray, ptr)
        break
      default:
        ptr.pos += chunkLength
    }
    ptr.pos += 4 // CRC
  }
  return info
}
