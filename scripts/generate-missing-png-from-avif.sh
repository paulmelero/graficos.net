#!/usr/bin/env bash
set -euo pipefail

# Generate missing PNG files from AVIF sources in public/images/uploads.
#
# Behavior:
# - Iterates over *.avif files.
# - Creates <name>.png only if it does not already exist.
# - Never overwrites existing PNGs unless --force is passed.
#
# Usage:
#   bash scripts/generate-missing-png-from-avif.sh
#   bash scripts/generate-missing-png-from-avif.sh --force

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
UPLOADS_DIR="${ROOT_DIR}/public/images/uploads"
FORCE=false

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

  if [[ -f "${png}" && "${FORCE}" != "true" ]]; then
    ((skipped+=1))
    continue
  fi

  magick "${avif}" "${png}"
  ((generated+=1))
  echo "Generated ${png}"
done

echo "Done. Generated: ${generated}, Skipped: ${skipped}"
