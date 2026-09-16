#!/usr/bin/env python3
"""Build the display font cuts from the Font Lab 2 spec export.

For each confirmed family:
  1. pull the source from google/fonts (raw.githubusercontent — fonts.googleapis is
     unreachable from here, the repo is not)
  2. if the source is variable, pin it to the specced weight and wdth/slnt
  3. shift the vertical metrics by the nudge dialled in Font Lab, so the glyphs sit
     centred in the fixed display line box without any CSS or native offset
  4. for families that ship caps, remap the lowercase codepoints onto the uppercase
     glyphs — remapping cmap rather than copying outlines, so GPOS kerning keeps
     applying the uppercase pair values
  5. rename to the display token name, so `displayFont` in a team config names a real
     installed family with no translation step (and, incidentally, clears the OFL
     reserved-font-name clause)

Runs time-boxed and resumable: each invocation works until --seconds is up, records
what it finished in state.json, and picks up there next time. device_bash gives every
call a fresh ~45s shell, so a 145-family build has to survive being chopped up.
"""
import json, os, re, sys, time, urllib.request, urllib.parse, argparse, unicodedata
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SPECS = os.path.join(ROOT, 'display-specs-2026-08-31.json')
SRC = os.path.join(HERE, 'sources')
OUT = os.path.join(ROOT, 'built-fonts')
LIC = os.path.join(OUT, 'licenses')
STATE = os.path.join(HERE, 'state.json')
RAW = 'https://raw.githubusercontent.com/google/fonts/main'

def slug(n): return re.sub(r'[^a-z0-9]', '', n.lower())

def fetch(url, path):
    if os.path.exists(path) and os.path.getsize(path) > 200: return path
    os.makedirs(os.path.dirname(path), exist_ok=True)
    urllib.request.urlretrieve(url, path)
    return path

def metadata(family):
    """google/fonts stores each family under ofl|apache|ufl/<slug>/METADATA.pb."""
    p = os.path.join(SRC, slug(family), 'METADATA.pb')
    if os.path.exists(p):
        lic = open(os.path.join(SRC, slug(family), '.lic')).read().strip()
        return lic, open(p, encoding='utf8', errors='replace').read()
    for lic in ('ofl', 'apache', 'ufl'):
        try:
            t = urllib.request.urlopen(f'{RAW}/{lic}/{slug(family)}/METADATA.pb', timeout=20)
            body = t.read().decode('utf8', 'replace')
            os.makedirs(os.path.dirname(p), exist_ok=True)
            open(p, 'w', encoding='utf8').write(body)
            open(os.path.join(SRC, slug(family), '.lic'), 'w').write(lic)
            return lic, body
        except Exception:
            continue
    raise RuntimeError('no METADATA.pb for ' + family)

def source_file(family, spec):
    """Prefer the variable source (one file, any weight); else the static cut whose
       weight matches the spec."""
    lic, meta = metadata(family)
    recs = []
    for blk in re.findall(r'fonts\s*\{(.*?)\}', meta, re.S):
        fn = re.search(r'filename:\s*"([^"]+)"', blk)
        w = re.search(r'weight:\s*(\d+)', blk)
        st = re.search(r'style:\s*"([^"]+)"', blk)
        if fn: recs.append((fn.group(1), int(w.group(1)) if w else 400, st.group(1) if st else 'normal'))
    vf = [r for r in recs if '[' in r[0]]
    if vf:
        chosen = vf[0][0]
    else:
        norm = [r for r in recs if r[2] == 'normal'] or recs
        chosen = min(norm, key=lambda r: abs(r[1] - spec['weight']))[0]
    path = os.path.join(SRC, slug(family), chosen)
    fetch(f'{RAW}/{lic}/{slug(family)}/{urllib.parse.quote(chosen)}', path)
    return lic, path

def pin(font, spec):
    """Pin every axis: wght to the specced weight, wdth/slnt to the specced value,
       everything else to its default. css2 pins unrequested axes too — this keeps the
       static cut identical to what Font Lab previewed."""
    if 'fvar' not in font: return font, {}
    loc, applied = {}, {}
    for a in font['fvar'].axes:
        v = a.defaultValue
        if a.axisTag == 'wght': v = spec['weight']
        elif a.axisTag in (spec.get('axes') or {}): v = (spec['axes'])[a.axisTag]
        v = max(a.minValue, min(a.maxValue, v))
        loc[a.axisTag] = v
        applied[a.axisTag] = v
    return instancer.instantiateVariableFont(font, loc, inplace=False, updateFontNames=False), applied

def shift_metrics(font, units):
    """Move the baseline inside the line box. The box height (ascent+|descent|) is
       preserved and only its midpoint moves, so nothing about line layout changes —
       only where the glyphs sit in it. Positive = down."""
    if not units: return 0
    h, o = font['hhea'], font['OS/2']
    h.ascent += units; h.descent += units
    o.sTypoAscender += units; o.sTypoDescender += units
    o.usWinAscent = max(0, o.usWinAscent + units)
    o.usWinDescent = max(0, o.usWinDescent - units)
    return units

def make_caps(font):
    """Point every lowercase codepoint at its uppercase glyph. Outlines are untouched,
       so kerning, GSUB and hinting all still address the real uppercase glyph."""
    best = font.getBestCmap()
    n = 0
    for t in font['cmap'].tables:
        if not t.isUnicode(): continue
        for cp in list(t.cmap):
            ch = chr(cp)
            up = ch.upper()
            if len(up) != 1 or up == ch: continue
            gn = best.get(ord(up))
            if gn and t.cmap[cp] != gn:
                t.cmap[cp] = gn; n += 1
    return n

def rename(font, family, weight):
    """Single-weight family: nameID 1 is the token name and the subfamily stays
       Regular, so `font-family: '<token>'` resolves the same way everywhere and Figma
       lists one unambiguous entry. usWeightClass carries the real weight.
       Copyright, license and vendor records (0, 7-14) are left alone — OFL requires
       them to travel with the file."""
    nt = font['name']
    ps = re.sub(r'[^A-Za-z0-9]', '', family) + '-Regular'
    keep = {0, 7, 8, 9, 10, 11, 12, 13, 14}
    for rec in list(nt.names):
        if rec.nameID in (16, 17, 21, 22) or (rec.nameID not in keep and rec.nameID > 6):
            nt.removeNames(rec.nameID, rec.platformID, rec.platEncID, rec.langID)
    for (pid, eid, lid) in ((3, 1, 0x409), (1, 0, 0)):
        nt.setName(family, 1, pid, eid, lid)
        nt.setName('Regular', 2, pid, eid, lid)
        nt.setName(f'{family}; display cut', 3, pid, eid, lid)
        nt.setName(family, 4, pid, eid, lid)
        nt.setName(ps, 6, pid, eid, lid)
    font['OS/2'].usWeightClass = int(weight)

def build(family, spec, lh):
    lic, src = source_file(family, spec)
    token = spec['name'] or family
    upm_probe = TTFont(src)['head'].unitsPerEm
    ratio = lh['900'] / spec['sizes']['900']
    units = round((spec.get('nudge') or 0) / 100 * ratio * upm_probe)
    cuts = []
    if spec['caps'] in ('none', 'both'): cuts.append((token, False))
    if spec['caps'] in ('caps', 'both'): cuts.append((token + ' Caps', True))
    made = []
    for name, caps in cuts:
        f = TTFont(src)
        f, applied = pin(f, spec)
        shift_metrics(f, units)
        swapped = make_caps(f) if caps else 0
        rename(f, name, spec['weight'])
        os.makedirs(OUT, exist_ok=True)
        path = os.path.join(OUT, name + '.ttf')
        f.save(path)
        made.append({'file': os.path.basename(path), 'family': name, 'caps': caps,
                     'swapped': swapped, 'shiftUnits': units, 'upm': upm_probe,
                     'axes': applied, 'bytes': os.path.getsize(path)})
    os.makedirs(LIC, exist_ok=True)
    for cand in ('OFL.txt', 'LICENSE.txt'):
        try:
            fetch(f'{RAW}/{lic}/{slug(family)}/{cand}', os.path.join(LIC, f'{token} — {cand}'))
            break
        except Exception:
            continue
    return {'source': os.path.basename(src), 'license': lic, 'nudge': spec.get('nudge') or 0,
            'weight': spec['weight'], 'caps': spec['caps'], 'cuts': made}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--seconds', type=float, default=35)
    a = ap.parse_args()
    data = json.load(open(SPECS)); S = data['specs']; lh = data['lineHeights']
    state = json.load(open(STATE)) if os.path.exists(STATE) else {'done': {}, 'errors': {}}
    t0 = time.time(); n = 0
    for fam, spec in S.items():
        if fam in state['done']: continue
        if time.time() - t0 > a.seconds: break
        try:
            state['done'][fam] = build(fam, spec, lh)
            state['errors'].pop(fam, None)
        except Exception as e:
            state['errors'][fam] = repr(e)[:200]
        n += 1
    json.dump(state, open(STATE, 'w'), indent=1)
    print(f'built {n} this pass | done {len(state["done"])}/{len(S)} | errors {len(state["errors"])}')
    if state['errors']: print('errors:', json.dumps(state['errors'], indent=1)[:1200])

if __name__ == '__main__':
    main()
