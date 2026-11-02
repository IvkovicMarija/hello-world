#!/usr/bin/env bash
# Trim AAC priming padding so each file is exactly its target length (video copied, audio re-encoded).
# Usage: ./scripts/finalize.sh [seconds] [files...]   (defaults: 25 and the two playbook renders)
set -euo pipefail
DUR=${1:-25}
shift || true
FILES=("$@")
[ ${#FILES[@]} -eq 0 ] && FILES=(out/meta-playbook-25s.mp4 out/meta-playbook-25s_4x5.mp4)
for f in "${FILES[@]}"; do
  ffmpeg -loglevel error -y -i "$f" -t "$DUR" -c:v copy -c:a aac -b:a 192k \
    -af "atrim=0:$DUR,asetpts=N/SR/TB" -movflags +faststart "${f%.mp4}.tmp.mp4"
  mv "${f%.mp4}.tmp.mp4" "$f"
  ffprobe -v error -show_entries format=duration -of csv=p=0 "$f"
done
