#!/usr/bin/env python3
"""
build-ui-fonts.py — self-host the two UI faces, so rendering needs no CDN.

Inter and Material Symbols Rounded used to come from a <link> to
fonts.googleapis.com in every page head. That made a third-party CDN a hard
dependency of rendering: offline, behind a proxy, or on a locked-down network,
every page lost its icons and its UI type — and crnl-loader.js carried a JS gate
that blanked the whole page for up to three seconds waiting for them.

Both are now built into fonts/ from upstream sources:

  Inter                      google/fonts ofl/inter        (OFL 1.1)
  Material Symbols Rounded   google/material-design-icons  (Apache 2.0)

Inter keeps its `wght` axis, so one file serves 400/600/700/900; `opsz` is
pinned because no rule sets it. Material Symbols keeps `FILL` (what
.icon-outlined switches) and `opsz` (the size ramp sets 20/24/40/48); `wght` and
`GRAD` are pinned, because every rule that sets them sets 400 and 0.

**The icon font is subset to the icons actually used**, which is what turns 15MB
into tens of KB. An icon name outside the subset renders as its own letters —
"home" rather than a house — so scripts/check-icons.mjs compares the names in
the markup against fonts/icons.json, which this script writes. Add an icon, run
`npm run check`, and it tells you to re-run this.

Two things about this font that cost an afternoon, both worth not rediscovering:

  - **An icon is a ligature over its own name**, and the ligature's components
    are *glyph names*, not characters: `arrow_back` is a + r + r + o + w +
    underscore + b + a + c + k. Reconstructing the name means mapping each
    component glyph back through cmap.
  - **Every letter glyph is encoded twice**, at its uppercase and lowercase
    codepoint. Walking cmap in codepoint order and keeping the first hit spells
    every name in capitals, and then nothing matches.

Run:    python3 scripts/build-ui-fonts.py
Needs:  pip install fonttools brotli, and raw.githubusercontent.com reachable
"""
import json, os, re, subprocess, sys, tempfile, urllib.request
from fontTools.ttLib import TTFont

ROOT  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS = os.path.join(ROOT, 'fonts')
CACHE = os.path.join(tempfile.gettempdir(), 'ds-ui-font-sources')

LICENCES = {
    'Inter — OFL.txt':
        'https://raw.githubusercontent.com/google/fonts/main/ofl/inter/OFL.txt',
    'Material Symbols Rounded — Apache 2.0.txt':
        'https://raw.githubusercontent.com/google/material-design-icons/master/LICENSE',
}

SOURCES = {
    'Inter.ttf':
        'https://raw.githubusercontent.com/google/fonts/main/ofl/inter/'
        'Inter%5Bopsz%2Cwght%5D.ttf',
    'MaterialSymbolsRounded.ttf':
        'https://raw.githubusercontent.com/google/material-design-icons/master/'
        'variablefont/MaterialSymbolsRounded%5BFILL%2CGRAD%2Copsz%2Cwght%5D.ttf',
}

# The Google "latin" range, plus arrows, maths and the marks the demo copy uses
# (⌘ ⚠ ✓ ×). Ranges rather than scanned text, so new copy cannot silently lose
# a glyph the way a text-derived subset would.
INTER_UNICODES = (
    'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,'
    'U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2190-21FF,'
    'U+2212,U+2215,U+2318,U+26A0,U+2713-2714,U+FEFF,U+FFFD'
)

# Where icon names can appear. Kept in step with scripts/check-icons.mjs.
SCAN_DIRS = ('demo', 'tools', 'css', 'src')
SCAN_EXT  = ('.html', '.js', '.mjs', '.tsx', '.ts')
SKIP_DIRS = {'node_modules', 'built-fonts', '_build', 'licenses'}

# A call or an assignment can hold more than one name — `icon(dark ? 'dark_mode'
# : 'light_mode')` is how the harness swaps its toggle. Matching only the first
# literal after `icon(` missed the second, the font shipped without it, and the
# toggle rendered the word "dark_mode". So these capture the whole expression
# and every quoted token inside it is taken as a candidate.
ICON_PATTERNS = (
    re.compile(r'<span[^>]*class="[^"]*(?:material-symbols-rounded|\bicon\b)[^"]*"[^>]*>\s*([a-z0-9_]+)\s*</span>', re.S),
)
ICON_EXPRESSIONS = (
    re.compile(r'\bicon\(([^)]*)\)'),                  # the harness helper
    re.compile(r'textContent\s*=\s*([^;\n]+)'),        # glyph swaps in JS
)
LITERAL = re.compile(r"'([a-z][a-z0-9_]*)'")

def scan_icon_names():
    names = set()
    for top in SCAN_DIRS:
        for dirpath, dirs, files in os.walk(os.path.join(ROOT, top)):
            dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
            for fn in files:
                if not fn.endswith(SCAN_EXT):
                    continue
                src = open(os.path.join(dirpath, fn), encoding='utf-8', errors='ignore').read()
                for pat in ICON_PATTERNS:
                    names |= set(pat.findall(src))
                for pat in ICON_EXPRESSIONS:
                    for expr in pat.findall(src):
                        names |= set(LITERAL.findall(expr))
    return {n for n in names if len(n) > 1}

def fetch(name, url=None):
    os.makedirs(CACHE, exist_ok=True)
    path = os.path.join(CACHE, name)
    if not os.path.exists(path):
        print(f'  fetching {name} …')
        with urllib.request.urlopen(url or SOURCES[name]) as r, open(path, 'wb') as out:
            out.write(r.read())
    return path

def fetch_licences():
    """Redistributing a font means shipping its licence with it."""
    out = os.path.join(FONTS, 'licenses')
    os.makedirs(out, exist_ok=True)
    for name, url in LICENCES.items():
        dst = os.path.join(out, name)
        if not os.path.exists(dst):
            open(dst, 'wb').write(open(fetch(name, url), 'rb').read())

def run(*args):
    r = subprocess.run(args, capture_output=True, text=True)
    if r.returncode:
        sys.exit(f'{args[0]} failed:\n{r.stderr.strip()[-2000:]}')

def ligature_map(font):
    """Every ligature in the font, as {icon name: target glyph}."""
    cmap = font.getBestCmap()
    g2c = {}
    for cp, gname in sorted(cmap.items()):
        # Letters are encoded at both cases; the lowercase one spells the name.
        ch = chr(cp)
        if gname not in g2c or (g2c[gname].isupper() and ch.islower()):
            g2c[gname] = ch

    def subtables():
        for lk in font['GSUB'].table.LookupList.Lookup:
            for st in lk.SubTable:
                yield st.ExtSubTable if type(st).__name__ == 'ExtensionSubst' else st

    out = {}
    for st in subtables():
        for first, entries in getattr(st, 'ligatures', {}).items():
            for e in entries:
                chars = [g2c.get(g) for g in [first] + list(e.Component)]
                if all(chars):
                    out[''.join(chars)] = e.LigGlyph
    return out

def build_inter(tmp):
    src, pinned = fetch('Inter.ttf'), os.path.join(tmp, 'inter-pinned.ttf')
    run(sys.executable, '-m', 'fontTools.varLib.instancer', src, 'opsz=14', '-o', pinned)
    out = os.path.join(FONTS, 'inter.woff2')
    run('pyftsubset', pinned, f'--output-file={out}', '--flavor=woff2',
        f'--unicodes={INTER_UNICODES}', '--name-IDs=*', '--name-legacy')
    return os.path.getsize(out)

def prune_ligatures(font, names):
    """Drop every ligature but the ones we want, in place.

    This has to happen *before* pyftsubset runs. The subsetter closes over the
    layout features it keeps, so retaining `liga` with all 26 letters present
    drags in every one of the font's 4,284 icons — 5,904 glyphs and 1.2MB for a
    52-icon subset. Pruning first leaves closure nothing to expand into.
    """
    cmap = font.getBestCmap()
    g2c = {}
    for cp, gname in sorted(cmap.items()):
        ch = chr(cp)
        if gname not in g2c or (g2c[gname].isupper() and ch.islower()):
            g2c[gname] = ch

    def subtables():
        for lk in font['GSUB'].table.LookupList.Lookup:
            for st in lk.SubTable:
                yield st.ExtSubTable if type(st).__name__ == 'ExtensionSubst' else st

    kept = 0
    for st in subtables():
        ligs = getattr(st, 'ligatures', None)
        if ligs is None:
            continue
        for first, entries in list(ligs.items()):
            keep = []
            for e in entries:
                chars = [g2c.get(g) for g in [first] + list(e.Component)]
                if all(chars) and ''.join(chars) in names:
                    keep.append(e)
            if keep:
                ligs[first] = keep
                kept += len(keep)
            else:
                del ligs[first]
    return kept

def build_symbols(tmp, names):
    src = fetch('MaterialSymbolsRounded.ttf')
    lig = ligature_map(TTFont(src))
    unknown = sorted(n for n in names if n not in lig)
    wanted = set(names)
    keep = sorted({lig[n] for n in names if n in lig})

    pinned = os.path.join(tmp, 'symbols-pinned.ttf')
    run(sys.executable, '-m', 'fontTools.varLib.instancer', src, 'wght=400', 'GRAD=0', '-o', pinned)

    trimmed = os.path.join(tmp, 'symbols-trimmed.ttf')
    font = TTFont(pinned)
    prune_ligatures(font, wanted)
    font.save(trimmed)

    out = os.path.join(FONTS, 'material-symbols-rounded.woff2')
    # The target glyphs, plus the letters that spell them so the surviving
    # ligature lookups still have their inputs.
    letters = ''.join(sorted(set(''.join(names))))
    run('pyftsubset', trimmed, f'--output-file={out}', '--flavor=woff2',
        '--glyphs=' + ','.join(keep), f'--text={letters}',
        '--layout-features+=liga,dlig,clig,rlig', '--name-IDs=*', '--name-legacy')
    return os.path.getsize(out), keep, unknown

def main():
    names = sorted(scan_icon_names())
    if not names:
        sys.exit('build-ui-fonts: found no icon names — refusing to ship an empty icon font')
    print(f'{len(names)} icon name(s) in use')

    os.makedirs(FONTS, exist_ok=True)
    fetch_licences()
    with tempfile.TemporaryDirectory() as tmp:
        inter_bytes = build_inter(tmp)
        sym_bytes, keep, unknown = build_symbols(tmp, names)

    # Prove it before writing the manifest: re-read the built font and check
    # every name still resolves. A subset that dropped a ligature is exactly
    # the failure this build is prone to.
    built = ligature_map(TTFont(os.path.join(FONTS, 'material-symbols-rounded.woff2')))
    lost = sorted(n for n in names if n not in built and n not in unknown)
    if lost:
        sys.exit(f'build-ui-fonts: {len(lost)} ligature(s) did not survive subsetting: {" ".join(lost)}')

    shipped = sorted(n for n in names if n not in unknown)
    json.dump({
        'note': 'GENERATED by scripts/build-ui-fonts.py. `icons` is what the font '
                'contains; any other name renders as its own letters. `ignored` is '
                'candidates the scan picked up that are not Material Symbols names '
                'at all — string literals in the same expressions icon names live '
                'in — recorded so check-icons does not keep reporting them.',
        'count': len(shipped),
        'icons': shipped,
        'ignored': unknown,
        'bytes': {'inter.woff2': inter_bytes,
                  'material-symbols-rounded.woff2': sym_bytes},
    }, open(os.path.join(FONTS, 'icons.json'), 'w'), indent=1)

    print(f'  inter.woff2                     {inter_bytes/1024:7.1f} KB')
    print(f'  material-symbols-rounded.woff2  {sym_bytes/1024:7.1f} KB   '
          f'{len(keep)} glyph(s), {len(names)} ligature(s) verified')
    if unknown:
        print(f'  not Material Symbols names, ignored: {" ".join(unknown)}')
    return 0

if __name__ == '__main__':
    sys.exit(main())
