import { assertEquals } from 'https://deno.land/std@0.92.0/testing/asserts.ts'
import { parsePngFormat } from '../reader_.ts'

const imagePaths = {
  retina: './examples/retina/7127a0c2a987ea50dbba0ebd6455c206.png',
  nonRetina: './examples/non-retina/8d132d64902c1323ffa8ca688b2c40eb.png',
  pixelSlate: './examples/pixel-slate/a86156b8f48ed5670eb8a71ab73b876c.png'
}

Deno.test('reader_.parsePngFormat: Retina screenshots', async () => {
  const data: Uint8Array = await Deno.readFile(imagePaths.retina)
  const { width, height, dpi } = await parsePngFormat(data)
  assertEquals(width, 1102)
  assertEquals(height, 994)
  assertEquals(dpi, 144)
})

Deno.test('reader_.parsePngFormat: Non retina screenshots', async () => {
  const data: Uint8Array = await Deno.readFile(imagePaths.nonRetina)
  const { width, height, dpi } = await parsePngFormat(data)
  assertEquals(width, 49)
  assertEquals(height, 42)
  assertEquals(dpi, undefined)
})

Deno.test('reader_.parsePngFormat: PixelSlate screenshots', async () => {
  const data: Uint8Array = await Deno.readFile(imagePaths.pixelSlate)
  const { width, height, dpi } = await parsePngFormat(data)
  assertEquals(width, 1028)
  assertEquals(height, 418)
  assertEquals(dpi, 162)
})
