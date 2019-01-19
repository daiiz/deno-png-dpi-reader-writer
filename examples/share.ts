import {open, copy, Buffer} from 'deno'

export const loadLocalImage = async (srcPath): Promise<Buffer> => {
  const imgFile = await open(srcPath)
  // https://github.com/denoland/deno/blob/master/js/buffer.ts
  const buf = new Buffer()
  await copy(buf, imgFile)
  return buf // Buffer {off: 0, buf: []}
}

export const fetchImage = async (srcUrl): Promise<Buffer> => {
  // https://github.com/denoland/deno/blob/master/js/fetch.ts
  const res = await fetch(srcUrl)
  const buf = new Buffer(await res.arrayBuffer())
  return buf
}
