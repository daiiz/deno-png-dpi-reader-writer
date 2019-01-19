# deno-png-dpi-reader-writer

Reader/Writer for png image's pHYs chunk. \
A [deno](https://github.com/denoland/deno) port of [png-dpi-reader-writer](https://github.com/daiiz/png-dpi-reader-writer).

## Usage
Detect width, height and DPI for PNG image.
```ts
// buf: deno/Buffer
const {width, height, dpi} = await parsePngFormat(buf)
```

## Examples
### Reader
```
$ deno examples/reader.ts ./examples/retina/7127a0c2a987ea50dbba0ebd6455c206.png
$ deno https://denopkg.com/daiiz/deno-png-dpi-reader/examples/reader.ts --allow-net https://i.gyazo.com/7127a0c2a987ea50dbba0ebd6455c206.png
```

Result:
```
{ width: 1102, height: 994, dpi: 144 }
```

### Writer
Write DPI for PNG image.
```
$ deno ./examples/writer.ts ./examples/non-retina/button.png 72 > a.png
```
