# deno-png-dpi-reader

Reader for png image's pHYs chunk. \
An implementation of a part of [png-dpi-reader-writer](https://github.com/daiiz/png-dpi-reader-writer) for deno.

## Usage
Detect width, height and DPI for PNG image.
```ts
// buf: Buffer
const {width, height, dpi} = await parsePngFormat(buf)
```

## Examples
```
$ deno examples/reader.ts ./examples/retina/7127a0c2a987ea50dbba0ebd6455c206.png
$ deno examples/reader.ts --allow-net https://i.gyazo.com/7127a0c2a987ea50dbba0ebd6455c206.png
```
