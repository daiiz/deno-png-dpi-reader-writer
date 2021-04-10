import { assertEquals } from 'https://deno.land/std@0.92.0/testing/asserts.ts'
import { parsePngFormat, writePngDpi } from '../mod.ts'
import { loadLocalImage } from '../examples/share.ts'

const imagePaths = {
  retina: './examples/retina/7127a0c2a987ea50dbba0ebd6455c206.png',
  nonRetina: './examples/non-retina/8d132d64902c1323ffa8ca688b2c40eb.png'
}

Deno.test('writePngDpi: DPI should not be overwritten.', async () => {
  const srcImage = imagePaths.retina
  const rawBuf: Deno.Buffer = await loadLocalImage(srcImage)
  const raw = await parsePngFormat(rawBuf)
  assertEquals(raw.width, 1102)
  assertEquals(raw.height, 994)
  assertEquals(raw.dpi, 144)

  const buf: Deno.Buffer = await loadLocalImage(srcImage)
  const newDpi = 72
  const arr: Uint8Array = await writePngDpi(buf, newDpi)
  const { width, height, dpi } = await parsePngFormat(new Deno.Buffer(arr))
  assertEquals(width, raw.width)
  assertEquals(height, raw.height)
  assertEquals(dpi, raw.dpi)
})

Deno.test('writePngDpi: DPI write to chunk should be successful', async () => {
  const srcImagePath = imagePaths.nonRetina
  const rawBuf: Deno.Buffer = await loadLocalImage(srcImagePath)
  const raw = await parsePngFormat(rawBuf)
  assertEquals(raw.width, 49)
  assertEquals(raw.height, 42)
  assertEquals(raw.dpi, undefined)

  const buf: Deno.Buffer = await loadLocalImage(srcImagePath)
  const newDpi = 72
  const arr: Uint8Array = await writePngDpi(buf, newDpi)
  const { width, height, dpi } = await parsePngFormat(new Deno.Buffer(arr.buffer))
  assertEquals(width, raw.width)
  assertEquals(height, raw.height)
  assertEquals(dpi, newDpi)
})
