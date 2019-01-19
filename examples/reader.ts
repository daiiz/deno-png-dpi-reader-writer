import {open, copy, args, Buffer} from 'deno'
import {parsePngFormat} from '../mod.ts'

console.log(args)

const loadImage = async (srcPath): Promise<Buffer> => {
  const imgFile = await open(srcPath)
  // https://github.com/denoland/deno/blob/master/js/buffer.ts
  const buf = new Buffer()
  await copy(buf, imgFile)
  return buf // Buffer {off: 0, buf: []}
}

const fetchImage = async (srcUrl): Promise<Buffer> => {
  // https://github.com/denoland/deno/blob/master/js/fetch.ts
  const res = await fetch(srcUrl)
  const buf = new Buffer(await res.arrayBuffer())
  return buf
}

const main = async () => {
  if (!args[1]) throw new Error('image url is required.')

  const srcUrl = args[1]
  let buf: Buffer
  if (!/https?:\/\//.test(srcUrl)) {
    // load local image
    buf = await loadImage(srcUrl)
  } else {
    // fetch image
    buf = await fetchImage(srcUrl)
  }
  console.log(await parsePngFormat(buf))
}

main()

