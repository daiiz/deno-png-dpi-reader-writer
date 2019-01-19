import {open, copy, args, Buffer} from 'deno'
import {parsePngFormat} from '../mod.ts'

console.log(args)

const loadImage = async srcPath => {
  const imgFile = await open(srcPath)
  const buf = new Buffer()
  await copy(buf, imgFile)
  return buf // Buffer {off: 0, buf: []}
}

const main = async () => {
  if (!args[1]) throw new Error('image url is required.')

  const srcUrl = args[1]
  let buf: Buffer
  // if () {

  // }
  buf = await loadImage('./examples/retina/button.png')
  console.log(await parsePngFormat(buf))
}

main()

