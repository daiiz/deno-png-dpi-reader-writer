import { loadLocalImage, fetchImage } from './share.ts'
import { parsePngFormat } from '../mod.ts'
const { args } = Deno

const main = async () => {
  if (!args[1]) throw new Error('image url is required.')

  const srcUrl = args[1]
  let buf: Deno.Buffer
  if (!/https?:\/\//.test(srcUrl)) {
    buf = await loadLocalImage(srcUrl)
  } else {
    buf = await fetchImage(srcUrl)
  }
  console.log(await parsePngFormat(buf))
}

main()
