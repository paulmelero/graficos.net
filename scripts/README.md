# Scripts

## Generate darker images for OG usage

Use `generate-darker-images.sh` to create `*_darker.png` files in `public/images/uploads`.

The script:

- scans `*.avif` files in `public/images/uploads`
- requires a sibling `*.png` with the same base name
- generates `<name>_darker.png` from the PNG
- skips existing outputs by default

### Run

From repository root:

```bash
bash scripts/generate-darker-images.sh
```

### Options

- **Overwrite existing outputs**

```bash
bash scripts/generate-darker-images.sh --force
```

- **Tune darkness** (default is `0.38`)

```bash
MULTIPLY=0.45 bash scripts/generate-darker-images.sh
```

Notes:

- Lower `MULTIPLY` => darker image.
- Higher `MULTIPLY` => lighter image.
- Requires ImageMagick (`magick` command). Install on macOS with:

```bash
brew install imagemagick
```
