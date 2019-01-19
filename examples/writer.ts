import {args, Buffer, stdout} from 'deno'
import {loadLocalImage, fetchImage} from './share.ts'
import {writePngDpi} from '../mod.ts'

const main = async () => {
  if (!args[1]) throw new Error('image url is required.')
  if (!args[2]) throw new Error('dpi is required.')

  const srcUrl = args[1]
  const dpi = +args[2]

  let buf: Buffer
  if (!/https?:\/\//.test(srcUrl)) {
    buf = await loadLocalImage(srcUrl)
  } else {
    buf = await fetchImage(srcUrl)
  }

  const arr: Uint8Array = await writePngDpi(buf, dpi)
  stdout.write(arr)
}

main()
