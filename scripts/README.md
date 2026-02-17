# Scripts

## Generate missing PNG files from AVIF

`generate-missing-png-from-avif.sh` creates PNG files in `public/images/uploads` only when a sibling PNG is missing.

### What it does

- scans all `*.avif` files in `public/images/uploads`
- for each file, checks if `<name>.png` exists
- if not, generates `<name>.png` from `<name>.avif`
- skips existing PNGs by default

### Run

From repository root:

```bash
bash scripts/generate-missing-png-from-avif.sh
```

### Optional: overwrite existing PNGs

```bash
bash scripts/generate-missing-png-from-avif.sh --force
```

### Requirement

ImageMagick (`magick` command):

```bash
brew install imagemagick
```
