import { loadLocalImage, fetchImage } from './share.ts'
import { parsePngFormat } from '../mod.ts'
const { args } = Deno

const main = async () => {
  const srcUrl = args[0]
  if (!srcUrl) throw new Error('image url is required.')

  let buf: Deno.Buffer
  if (!/https?:\/\//.test(srcUrl)) {
    buf = await loadLocalImage(srcUrl)
  } else {
    buf = await fetchImage(srcUrl)
  }
  console.log(await parsePngFormat(buf))
}

main()
