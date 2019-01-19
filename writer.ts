import {Buffer} from 'deno'
import {crc} from './crc32.ts'
import {parsePngFormat} from './reader.ts'

// Number of pixels per unit when DPI is 72
// Number of pixels per unit when devicePixelRatio is 1
const PX_PER_METER = 2835

function bytes (num, byteLength): Array<number> {
  const binStr = num.toString(2).padStart(byteLength * 8, '0')
  const binArr = binStr.match(/\d{8}/g)
  return binArr.map(v => parseInt(v, 2))
}

async function getInsertPosition(buf: Buffer): Promise<number> {
  const _buf = new Buffer(buf.bytes())
  const {dpi} = await parsePngFormat(_buf)
  // 既存のpHYsを上書きしない
  if (dpi !== undefined) return -1
  // すべて既読、つまり、"IDAT"が存在しない
  if (_buf.empty()) return -1
  // 既読bytes数
  const readBytesNum = _buf.capacity - _buf.length
  // chunkLengthと"IDAT"ぶんだけ戻した位置
  return readBytesNum - (4 + 4)
}

function makeChunkPhys (dpi: number): Uint8Array {
  const type = 'pHYs'.split('').map(c => c.charCodeAt(0))
  const devicePixelRatio = dpi / 72
  const pixelsPerMeter = Math.floor(PX_PER_METER * devicePixelRatio)
  const data = [
    ...bytes(pixelsPerMeter, 4),
    ...bytes(pixelsPerMeter, 4),
    1 // meter
  ]
  const pHYsChunk = [
    0, 0, 0, 9, // 9 bytes
    ...type,
    ...data,
    ...bytes(crc([...type, ...data]), 4)
  ]
  return new Uint8Array(pHYsChunk)
}

export async function writePngDpi(src: Buffer, dpi: number): Promise<Uint8Array> {
  const insertPosition = await getInsertPosition(src)
  if (insertPosition < 0) return src.bytes()

  // IDAT chunkの直前まで
  const imgHeader = new Uint8Array(insertPosition); src.read(imgHeader)
  const phys = makeChunkPhys(dpi)
  // IENDの末端まで
  const imgBody = new Uint8Array(src.capacity - insertPosition); src.read(imgBody)

  // if (!src.empty()) throw new Error('Something is wrong.')
  return new Uint8Array([
    ...Array.from(imgHeader),
    ...Array.from(phys),
    ...Array.from(imgBody)
  ])
}
