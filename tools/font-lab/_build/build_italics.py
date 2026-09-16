#!/usr/bin/env python3
"""Build the italic cuts for the display font library.

Companion to build_fonts.py. Two kinds of source:

  * 52 families where google/fonts ships a genuinely drawn italic — a separate
    `-Italic[wght].ttf` variable file or static `-Italic` cuts.
  * 7 families whose only italic-ish affordance is a `slnt` axis on the roman.
    Pinning that axis gives a mechanical oblique, not a drawn italic; the manifest
    records which is which so nobody mistakes one for the other later.

Packaged as the ITALIC STYLE OF THE EXISTING FAMILY, not as a new family: nameID 1
stays the token name, the subfamily becomes Italic, and the italic bits go on in
fsSelection/macStyle. macOS and Figma then group Regular + Italic under one entry,
and CSS reaches it with font-style: italic without displayFont changing. The caps
cuts get the same treatment, so `Gantry Caps` also gains an Italic style.

The vertical shift is the same number of font units as the roman. The nudge was
judged against the roman on the ramp, and Google's italics almost always inherit the
roman's vertical metrics — the build asserts that per family and reports any where
the two disagree, rather than silently applying a correction measured on a different
metric baseline.
"""
import json, os, re, sys, time, urllib.request, urllib.parse, argparse
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SPECS = os.path.join(ROOT, 'display-specs-2026-08-31.json')
SRC = os.path.join(HERE, 'sources')
OUT = os.path.join(ROOT, 'built-fonts')
STATE = os.path.join(HERE, 'state-italic.json')
ROMAN = os.path.join(HERE, 'state.json')
RAW = 'https://raw.githubusercontent.com/google/fonts/main'

def slug(n): return re.sub(r'[^a-z0-9]', '', n.lower())

def meta_text(family):
    return open(os.path.join(SRC, slug(family), 'METADATA.pb'), encoding='utf8', errors='replace').read()

def lic_of(family):
    return open(os.path.join(SRC, slug(family), '.lic')).read().strip()

def records(family):
    out = []
    for blk in re.findall(r'fonts\s*\{(.*?)\}', meta_text(family), re.S):
        fn = re.search(r'filename:\s*"([^"]+)"', blk)
        w = re.search(r'weight:\s*(\d+)', blk)
        st = re.search(r'style:\s*"([^"]+)"', blk)
        if fn: out.append((fn.group(1), int(w.group(1)) if w else 400, st.group(1) if st else 'normal'))
    return out

def fetch(family, filename):
    path = os.path.join(SRC, slug(family), filename)
    if os.path.exists(path) and os.path.getsize(path) > 200: return path
    urllib.request.urlretrieve(f'{RAW}/{lic_of(family)}/{slug(family)}/{urllib.parse.quote(filename)}', path)
    return path

def italic_source(family, spec):
    """Returns (path, kind). kind is 'italic' for a drawn italic, 'oblique' for a
       slnt-axis slant of the roman."""
    recs = records(family)
    ital = [r for r in recs if r[2] == 'italic']
    if ital:
        vf = [r for r in ital if '[' in r[0]]
        chosen = vf[0][0] if vf else min(ital, key=lambda r: abs(r[1] - spec['weight']))[0]
        return fetch(family, chosen), 'italic'
    roman = [r for r in recs if r[2] != 'italic']
    vf = [r for r in roman if '[' in r[0]]
    if not vf: raise RuntimeError('no italic and no variable roman')
    return fetch(family, vf[0][0]), 'oblique'

def pin(font, spec, kind):
    """Pin every axis. For an oblique, slnt goes to the slanted end of its range
       rather than the specced upright 0."""
    if 'fvar' not in font: return font, {}, 0.0
    loc, angle = {}, 0.0
    for a in font['fvar'].axes:
        v = a.defaultValue
        if a.axisTag == 'wght': v = spec['weight']
        elif a.axisTag == 'slnt' and kind == 'oblique':
            v = a.minValue          # slnt runs 0 → negative; negative is the slant
            angle = float(v)
        elif a.axisTag in (spec.get('axes') or {}): v = (spec['axes'])[a.axisTag]
        loc[a.axisTag] = max(a.minValue, min(a.maxValue, v))
    return instancer.instantiateVariableFont(font, loc, inplace=False, updateFontNames=False), loc, angle

def make_caps(font):
    best = font.getBestCmap(); n = 0
    for t in font['cmap'].tables:
        if not t.isUnicode(): continue
        for cp in list(t.cmap):
            ch = chr(cp); up = ch.upper()
            if len(up) != 1 or up == ch: continue
            gn = best.get(ord(up))
            if gn and t.cmap[cp] != gn: t.cmap[cp] = gn; n += 1
    return n

def rename_italic(font, family, weight, angle):
    nt = font['name']
    ps = re.sub(r'[^A-Za-z0-9]', '', family) + '-Italic'
    keep = {0, 7, 8, 9, 10, 11, 12, 13, 14}
    for rec in list(nt.names):
        if rec.nameID in (16, 17, 21, 22) or (rec.nameID not in keep and rec.nameID > 6):
            nt.removeNames(rec.nameID, rec.platformID, rec.platEncID, rec.langID)
    for (pid, eid, lid) in ((3, 1, 0x409), (1, 0, 0)):
        nt.setName(family, 1, pid, eid, lid)              # same family as the roman — that is what groups them
        nt.setName('Italic', 2, pid, eid, lid)
        nt.setName(f'{family} Italic; display cut', 3, pid, eid, lid)
        nt.setName(f'{family} Italic', 4, pid, eid, lid)
        nt.setName(ps, 6, pid, eid, lid)
    o = font['OS/2']
    o.usWeightClass = int(weight)
    o.fsSelection = (o.fsSelection | 0x01) & ~0x40        # ITALIC on, REGULAR off
    font['head'].macStyle |= 0x02
    cur = getattr(font['post'], 'italicAngle', 0) or 0
    if angle and not cur: font['post'].italicAngle = float(angle)

def build(family, spec, roman_rec):
    src, kind = italic_source(family, spec)
    token = spec['name'] or family
    shift = roman_rec['cuts'][0]['shiftUnits']            # same correction as the roman
    # sanity: does the italic share the roman's vertical metrics?
    rom = TTFont(os.path.join(SRC, slug(family), roman_rec['source']))
    it0 = TTFont(src)
    same = (rom['hhea'].ascent, rom['hhea'].descent) == (it0['hhea'].ascent, it0['hhea'].descent) \
           and rom['head'].unitsPerEm == it0['head'].unitsPerEm
    cuts = []
    if spec['caps'] in ('none', 'both'): cuts.append((token, False))
    if spec['caps'] in ('caps', 'both'): cuts.append((token + ' Caps', True))
    made = []
    for name, caps in cuts:
        f = TTFont(src)
        f, loc, angle = pin(f, spec, kind)
        if shift:
            h, o = f['hhea'], f['OS/2']
            h.ascent += shift; h.descent += shift
            o.sTypoAscender += shift; o.sTypoDescender += shift
            o.usWinAscent = max(0, o.usWinAscent + shift)
            o.usWinDescent = max(0, o.usWinDescent - shift)
        swapped = make_caps(f) if caps else 0
        rename_italic(f, name, spec['weight'], angle)
        path = os.path.join(OUT, f'{name} Italic.ttf')
        f.save(path)
        made.append({'file': os.path.basename(path), 'family': name, 'style': 'Italic',
                     'caps': caps, 'kind': kind, 'swapped': swapped, 'shiftUnits': shift,
                     'metricsMatchRoman': same, 'axes': loc,
                     'italicAngle': float(getattr(TTFont(path)['post'], 'italicAngle', 0) or 0),
                     'bytes': os.path.getsize(path)})
    return {'source': os.path.basename(src), 'kind': kind, 'metricsMatchRoman': same, 'cuts': made}

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--seconds', type=float, default=35)
    a = ap.parse_args()
    data = json.load(open(SPECS)); S = data['specs']
    roman = json.load(open(ROMAN))['done']
    sur = json.load(open(os.path.join(HERE, 'italic_survey.json')))
    targets = [f for f, d in sur.items() if d['italFiles'] or 'slnt' in d['axes']]
    state = json.load(open(STATE)) if os.path.exists(STATE) else {'done': {}, 'errors': {}}
    t0 = time.time(); n = 0
    for fam in targets:
        if fam in state['done']: continue
        if time.time() - t0 > a.seconds: break
        try:
            state['done'][fam] = build(fam, S[fam], roman[fam]); state['errors'].pop(fam, None)
        except Exception as e:
            state['errors'][fam] = repr(e)[:200]
        n += 1
    json.dump(state, open(STATE, 'w'), indent=1)
    cuts = sum(len(v['cuts']) for v in state['done'].values())
    print(f'built {n} families this pass | done {len(state["done"])}/{len(targets)} | cuts {cuts} | errors {len(state["errors"])}')
    if state['errors']: print(json.dumps(state['errors'], indent=1)[:1000])

if __name__ == '__main__':
    main()
