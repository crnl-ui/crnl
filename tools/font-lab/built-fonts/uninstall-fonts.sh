#!/bin/bash
# Remove every display font cut from ~/Library/Fonts. Only touches filenames
# listed in manifest.json, so nothing else in your font folder is at risk.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST="$HOME/Library/Fonts"
n=0
while IFS= read -r f; do
  if [ -n "$f" ] && [ -f "$DEST/$f" ]; then rm "$DEST/$f"; n=$((n+1)); fi
done < <(python3 -c "
import json,sys
for c in json.load(open('$HERE/manifest.json'))['cuts']: print(c['file'])
")
echo "Removed $n font files from $DEST. Quit and relaunch Figma for it to notice."
