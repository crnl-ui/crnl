#!/usr/bin/env python3
"""Merge tier 1 (hand-assigned) with tier 2 (harvested catalogue names) into
paid-index.json, then fold it into matches.js.

Tier 2 exists so a search RESOLVES, not so it recommends. Names harvested from
Wikipedia's classified list carry that classification, which maps onto a small set
of lineages; names harvested from a foundry catalogue with no classification get a
keyword read of the name itself, and where even that says nothing they are stored
with no lineage at all. A tier-2 row never claims a confidence.
"""
import io, json, re, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from paid_tier1 import TIER1

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
harvest = json.load(open(os.path.join(HERE, 'harvest.json')))
matches = re.search(r'window\.FL3_MATCH = (\{.*\});',
                    io.open(os.path.join(ROOT, 'matches.js'), encoding='utf8').read(), re.S)
MATCH = json.loads(matches.group(1))
CLUSTERS = MATCH['clusters']

# A Wikipedia classification is coarser than a lineage; it can only narrow the field.
CLASS_TO_CLUSTER = {
    'serif-oldstyle': 'R01', 'slab': 'R06', 'sans': 'S01', 'mono': 'M01',
    'script-informal': 'H04', 'script-formal': 'H05', 'blackletter': 'D02',
    'decorative': 'D09',
}
# Name-shape rules, applied before the coarse fallback. Deliberately few: a rule that
# fires on a word the designer chose is a guess about marketing, not about drawing.
NAME_RULES = [
    (r'\bmono\b|\bcode\b|typewriter', 'M01'),
    (r'condensed|compressed|narrow', 'S07'),
    (r'\bslab\b|egyptian|clarendon', 'R06'),
    (r'\bscript\b|\bhand\b|brush|marker', 'H04'),
    (r'fraktur|blackletter|textur|gothic text', 'D02'),
    (r'\bdidone\b|didot|bodoni', 'R04'),
    (r'garamond|jenson|aldine|renaissance', 'R01'),
    (r'\bcaslon\b', 'R02'),
    (r'baskerville|scotch|transitional', 'R03'),
    (r'grotesk|grotesque|gothic\b', 'S03'),
    (r'\bsans\b', 'S01'),
    (r'\bserif\b', 'R03'),
]
def guess(name):
    n = name.lower()
    for pat, cid in NAME_RULES:
        if re.search(pat, n): return cid
    return None

from lineage_corrections import MOVES, SECONDARY, ADDITIONS, PLACEMENTS
TIER1 = dict(TIER1)
for nm, e in ADDITIONS.items():
    if nm in TIER1: sys.exit('addition %r already in tier 1' % nm)
    TIER1[nm] = e

index = {}
for name, (cid, conf, foundry, lib, note) in TIER1.items():
    if cid not in CLUSTERS: sys.exit('tier1 %r points at unknown lineage %r' % (name, cid))
    index[name] = {'cluster': cid, 'tier': 1, 'confidence': conf,
                   'foundry': foundry, 'library': lib, 'note': note}

def add_tier2(name, foundry=None, cid=None, src=''):
    if name in index: return 0
    index[name] = {'cluster': cid, 'tier': 2, 'confidence': None,
                   'foundry': foundry, 'library': None, 'note': '', 'via': src}
    return 1

n2 = 0
for cls, names in harvest['byClassification'].items():
    for nm in names:
        n2 += add_tier2(nm, cid=guess(nm) or CLASS_TO_CLUSTER.get(cls), src='classification:' + cls)
for foundry, names in harvest['byFoundry'].items():
    for nm in names:
        if nm in index:
            index[nm].setdefault('foundry', None)
            if not index[nm].get('foundry'): index[nm]['foundry'] = foundry
            continue
        n2 += add_tier2(nm, foundry=foundry, cid=guess(nm), src='foundry:' + foundry)

# ── audit corrections ───────────────────────────────────────────────────────
# Applied to all three tables at once, so a move or a secondary lineage lands
# wherever that family appears — the paid index, the 663-family inventory, and the
# 145 built families keyed by token name.
tok2src = {(v['name'] or k): k for k, v in json.load(
    open(os.path.join(ROOT, 'display-specs-2026-08-31.json')))['specs'].items()}
src2tok = {v: k for k, v in tok2src.items()}
tables = [('paid', index), ('families', MATCH['families']), ('custom', MATCH['custom'])]
def keys_for(name):
    """A correction is written against the real family name; the custom table is keyed
       by the token name, so translate."""
    return {name, src2tok.get(name, name)}

moved = sec = 0
for name, (cid, via, why) in MOVES.items():
    if cid not in CLUSTERS: sys.exit('move %r -> unknown lineage %r' % (name, cid))
    for label, tbl in tables:
        for k in keys_for(name):
            if k in tbl:
                tbl[k]['clusterWas'] = tbl[k].get('cluster')
                tbl[k]['cluster'] = cid
                tbl[k]['movedVia'] = via; tbl[k]['movedWhy'] = why
                moved += 1
for name, (cid, via, why) in SECONDARY.items():
    if cid not in CLUSTERS: sys.exit('secondary %r -> unknown lineage %r' % (name, cid))
    for label, tbl in tables:
        for k in keys_for(name):
            if k in tbl and tbl[k].get('cluster') != cid:
                tbl[k]['cluster2'] = cid
                tbl[k]['cluster2Via'] = via; tbl[k]['cluster2Why'] = why
                sec += 1
# Lineages routed by script rather than by shape — the research is explicit that a
# Latin lookalike is not a valid substitute there, so the tool has to say so.
MATCH['scriptRouted'] = sorted(c for c in CLUSTERS if c[0] in 'ABCITKX')
MATCH['corrections'] = {'moves': {k: {'to': v[0], 'via': v[1], 'why': v[2]} for k, v in MOVES.items()},
                        'secondary': {k: {'to': v[0], 'via': v[1], 'why': v[2]} for k, v in SECONDARY.items()}}
print('applied %d move rows and %d secondary-lineage rows across the three tables' % (moved, sec))

# Promote the harvested names I can actually place, keeping the foundry and library
# the harvest already established.
promoted = 0
for nm, (cid, conf, note) in PLACEMENTS.items():
    if cid not in CLUSTERS: sys.exit('placement %r -> unknown lineage %r' % (nm, cid))
    e = index.get(nm)
    if not e: sys.exit('placement %r is not in the harvest' % nm)
    if e['tier'] == 1: sys.exit('placement %r is already tier 1' % nm)
    e.update(cluster=cid, tier=1, confidence=conf, note=note); e.pop('via', None)
    promoted += 1

# Anything still without a lineage is dropped. A search that returns a name with no
# recommendation behind it is a dead end, and 107 of them made the index look broader
# than it is.
# Also drop anything whose lineage is a bare guess with no foundry behind it — a
# recommendation nobody can trace is the same dead end as no recommendation.
dropped = sorted(n for n, v in index.items()
                 if not v['cluster'] or (v.get('confidence') == 'loose' and v.get('foundry') == 'unknown'))
for n in dropped: del index[n]
print('promoted %d harvested names to tier 1; dropped %d that stayed unplaceable' % (promoted, len(dropped)))
io.open(os.path.join(HERE, 'dropped-unplaced.txt'), 'w', encoding='utf8').write('\n'.join(dropped) + '\n')

MATCH['paid'] = index
MATCH['paidSources'] = harvest['sources']
out = ('// Font Lab 3 match data — generated by _build/make_matches.py and\n'
       '// _build/make_paid_index.py. Cluster prose is stored once; families carry\n'
       '// only what differs. `paid` is the paid-font index: tier 1 is hand-assigned\n'
       '// with a confidence, tier 2 is harvested catalogue names for search routing.\n'
       'window.FL3_MATCH = ' + json.dumps(MATCH, ensure_ascii=False, separators=(',', ':')) + ';\n')
io.open(os.path.join(ROOT, 'matches.js'), 'w', encoding='utf8').write(out)
json.dump(index, open(os.path.join(ROOT, 'paid-index.json'), 'w'), indent=1, ensure_ascii=False)

t1 = sum(1 for v in index.values() if v['tier'] == 1)
t2 = len(index) - t1
placed = sum(1 for v in index.values() if v['cluster'])
byconf = {}
for v in index.values():
    if v['tier'] == 1: byconf[v['confidence']] = byconf.get(v['confidence'], 0) + 1
print('paid families indexed:', len(index), '| tier 1:', t1, '| tier 2:', t2)
print('with a lineage assigned:', placed, '| no lineage (searchable, no recommendation):', len(index) - placed)
print('tier 1 confidence:', byconf)
print('matches.js bytes', len(out))
