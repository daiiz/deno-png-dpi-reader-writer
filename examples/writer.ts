import { loadLocalImage, fetchImage } from './share.ts'
import { writePngDpi } from '../mod.ts'
const { args, stdout } = Deno

const main = async () => {
  if (!args[0]) throw new Error('image url is required.')
  if (!args[1]) throw new Error('dpi is required.')

  const srcUrl = args[0]
  const dpi = +args[1]

  let buf: Deno.Buffer
  if (!/https?:\/\//.test(srcUrl)) {
    buf = await loadLocalImage(srcUrl)
  } else {
    buf = await fetchImage(srcUrl)
  }

  const arr: Uint8Array = await writePngDpi(buf, dpi)
  stdout.write(arr)
}

main()
