#!/usr/bin/env bash
# Trim AAC priming padding so each file is exactly 25.000 s (video copied, audio re-encoded).
set -euo pipefail
for f in out/meta-playbook-25s.mp4 out/meta-playbook-25s_4x5.mp4; do
  ffmpeg -loglevel error -y -i "$f" -t 25 -c:v copy -c:a aac -b:a 192k \
    -af "atrim=0:25,asetpts=N/SR/TB" -movflags +faststart "${f%.mp4}.tmp.mp4"
  mv "${f%.mp4}.tmp.mp4" "$f"
  ffprobe -v error -show_entries format=duration -of csv=p=0 "$f"
done
