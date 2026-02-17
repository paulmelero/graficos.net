#!/usr/bin/env bash
set -euo pipefail

# Generate *_darker.png from AVIF/PNG sibling pairs in public/images/uploads.
#
# Defaults:
# - Processes only files where both "<name>.avif" and "<name>.png" exist.
# - Skips existing "<name>_darker.png" files.
# - Uses a darkening multiply factor of 0.38 (similar to a strong black overlay).
#
# Usage:
#   bash scripts/generate-darker-images.sh
#   bash scripts/generate-darker-images.sh --force
#   MULTIPLY=0.45 bash scripts/generate-darker-images.sh

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
UPLOADS_DIR="${ROOT_DIR}/public/images/uploads"
FORCE=false
MULTIPLY="${MULTIPLY:-0.38}"

if [[ "${1:-}" == "--force" ]]; then
  FORCE=true
fi

if ! command -v magick >/dev/null 2>&1; then
  echo "Error: ImageMagick 'magick' command not found." >&2
  echo "Install with: brew install imagemagick" >&2
  exit 1
fi

if [[ ! -d "${UPLOADS_DIR}" ]]; then
  echo "Error: uploads directory not found: ${UPLOADS_DIR}" >&2
  exit 1
fi

cd "${UPLOADS_DIR}"

generated=0
skipped=0

shopt -s nullglob
for avif in *.avif; do
  base="${avif%.avif}"
  png="${base}.png"
  out="${base}_darker.png"

  # Only process if there is a PNG sibling.
  if [[ ! -f "${png}" ]]; then
    ((skipped+=1))
    continue
  fi

  if [[ -f "${out}" && "${FORCE}" != "true" ]]; then
    ((skipped+=1))
    continue
  fi

  magick "${png}" -evaluate multiply "${MULTIPLY}" "${out}"
  ((generated+=1))
  echo "Generated ${out}"
done

echo "Done. Generated: ${generated}, Skipped: ${skipped}"
