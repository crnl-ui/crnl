#!/bin/bash
# Install the display font cuts into ~/Library/Fonts.
#
#   ./install-fonts.sh            # shipping defaults only — 145 files, 145 families
#   ./install-fonts.sh roman      # every roman cut — 256 files, 256 families
#   ./install-fonts.sh all        # everything including italics — 369 files, 256 families
#
# Installing all of them puts 256 new families in the font menu of every app on this
# Mac, so the default is the narrow set. Run uninstall-fonts.sh to take them back out —
# it removes only files this script installed, by name, from the manifest.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST="$HOME/Library/Fonts"
MODE="${1:-defaults}"
mkdir -p "$DEST"

python3 - "$HERE" "$MODE" <<'PY' > /tmp/crnl-font-list.txt
import json, sys
here, mode = sys.argv[1], sys.argv[2]
cuts = json.load(open(f'{here}/manifest.json'))['cuts']
if mode == 'all':
    pick = cuts
elif mode == 'roman':
    pick = [c for c in cuts if c['style'] == 'Regular']
elif mode == 'defaults':
    pick = [c for c in cuts if c['style'] == 'Regular'
            and (c['caseMode'] == 'caps') == (c['cut'] == 'caps')]
else:
    sys.exit(f'unknown mode {mode!r} — use defaults, roman or all')
print('\n'.join(c['file'] for c in pick))
PY

COUNT=$(wc -l < /tmp/crnl-font-list.txt | tr -d ' ')
echo "Installing $COUNT font files ($MODE) into $DEST"
while IFS= read -r f; do
  [ -n "$f" ] && cp "$HERE/$f" "$DEST/$f"
done < /tmp/crnl-font-list.txt
rm -f /tmp/crnl-font-list.txt

cat <<'MSG'

Done.

Figma caches its font list at startup, so it will not see these until you:
  1. quit Figma Desktop completely (Cmd-Q, not just closing the window)
  2. relaunch it and reopen your file
  3. re-run the Desktop Bridge plugin

Each family carries ONE weight, with the real weight in usWeightClass — so the style
is always "Regular" (plus "Italic" where one exists), never "Black" or "Bold".
MSG
