#!/usr/bin/env bash
set -euo pipefail
for pdf in \
  public/materials/tec-002/week-1.pdf \
  public/materials/bus-001/week-1.pdf \
  public/materials/hos-001/week-1.pdf \
  public/materials/tur-001/week-1.pdf \
  public/materials/xdp-001/week-1.pdf \
  public/materials/gac-001/week-1.pdf; do
  echo "--- $pdf"
  pdfinfo "$pdf" | grep -E 'Pages|Page size'
  pdftotext "$pdf" - | grep -E -i 'overview|key ideas|exercise|knowledge|source|reflection|instructions' | head -12 || true
done
