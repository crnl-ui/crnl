#!/usr/bin/env python3
"""Check the 47-lineage taxonomy against fontjoy's learned font embeddings.

The lineages in font-match-research.md are a designer's judgement. This is the one
independent, non-opinion signal available: Jack000/fontjoy published 200-dimension
vectors for 1,883 Google font variants, learned by transfer from a pretrained net.
If the lineages track something real about the letterforms, families sharing one
should sit closer together than families that do not.

Two caveats that shape how the output should be read:

  * Coverage. The dataset predates most of the library — it reaches 57 of the 145
    families, so nothing here says anything about the other 88.
  * Base rate. Those 57 spread over 27 lineages and 13 are the only member of theirs
    in the subset, so their nearest neighbour CANNOT be same-lineage. Raw
    nearest-neighbour agreement is meaningless without dividing by chance.

The vectors are ~29MB and deliberately NOT committed. Fetch them with:
  curl -sLO https://raw.githubusercontent.com/Jack000/fontjoy/master/vectors-200.tsv
  curl -sLO https://raw.githubusercontent.com/Jack000/fontjoy/master/metadata.tsv
"""
import csv, io, json, re, math, statistics, itertools, collections, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
EXT = os.path.join(HERE, 'external')
ROOT = os.path.dirname(HERE)
for f in ('metadata.tsv', 'vectors-200.tsv'):
    if not os.path.exists(os.path.join(EXT, f)):
        sys.exit('missing %s — see the fetch commands in this file’s docstring' % f)

meta = list(csv.DictReader(io.open(os.path.join(EXT, 'metadata.tsv'), encoding='utf8'), delimiter='\t'))
vec = [[float(x) for x in l.rstrip('\n').split('\t')]
       for l in io.open(os.path.join(EXT, 'vectors-200.tsv'), encoding='utf8')]
fams = collections.defaultdict(list)
for m, v in zip(meta, vec):
    fams[m['name'].rsplit(' ', 1)[0] if ' ' in m['name'] else m['name']].append((m['variant'], v))

M = json.loads(re.search(r'window\.FL3_MATCH = (\{.*\});',
               io.open(os.path.join(ROOT, 'matches.js'), encoding='utf8').read(), re.S).group(1))
specs = json.load(open(os.path.join(ROOT, 'display-specs-2026-08-31.json')))['specs']
tok2src = {(v['name'] or k): k for k, v in specs.items()}
cluster = {tok2src.get(t, t): e['cluster'] for t, e in M['custom'].items()}

WMAP = {100:'100',200:'200',300:'300',400:'regular',500:'500',600:'600',700:'700',800:'800',900:'900',1000:'900'}
def at_weight(fam, w):
    """The specced weight where it exists — a black cut and a light cut of one family
       are far apart in this space, so comparing defaults would be comparing the wrong
       thing."""
    d = dict(fams[fam]); want = WMAP.get(int(w), 'regular')
    if want in d: return d[want]
    for x in ('900','800','700','600','500','regular','300','200','100'):
        if x in d: return d[x]

cov = {s: at_weight(s, specs[s]['weight']) for s in specs if s in fams}
cov = {k: v for k, v in cov.items() if v}
names = sorted(cov)
def cos(a, b):
    return sum(x*y for x, y in zip(a, b)) / (math.sqrt(sum(x*x for x in a)) * math.sqrt(sum(x*x for x in b)))

same, diff = [], []
for a, b in itertools.combinations(names, 2):
    (same if cluster.get(a) == cluster.get(b) else diff).append(cos(cov[a], cov[b]))
sizes = collections.Counter(cluster.get(a) for a in names)
solo = [a for a in names if sizes[cluster.get(a)] == 1]
base = statistics.mean([sum(1 for b in names if b != a and cluster.get(b) == cluster.get(a)) / (len(names)-1)
                        for a in names])
nn = {a: max((b for b in names if b != a), key=lambda b: cos(cov[a], cov[b])) for a in names}
agree = [a for a in names if cluster.get(nn[a]) == cluster.get(a)]
elig = [a for a in names if sizes[cluster.get(a)] > 1]

print('covered %d of %d families, across %d lineages' % (len(names), len(specs), len(sizes)))
print('single-member lineages (can never agree): %d' % len(solo))
print('same-lineage   n=%-5d mean cos %.4f' % (len(same), statistics.mean(same)))
print('cross-lineage  n=%-5d mean cos %.4f' % (len(diff), statistics.mean(diff)))
print('separation %+.4f' % (statistics.mean(same) - statistics.mean(diff)))
print('nearest-neighbour agreement %.1f%% vs %.1f%% base rate  ->  %.1fx chance'
      % (100*len(agree)/len(names), 100*base, (len(agree)/len(names))/base))
print('restricted to the %d that could agree: %.0f%%'
      % (len(elig), 100*sum(1 for a in elig if cluster.get(nn[a]) == cluster.get(a))/len(elig)))
print('\ncross-lineage nearest neighbours, strongest first:')
rows = [(a, cluster.get(a), nn[a], cluster.get(nn[a]), cos(cov[a], cov[nn[a]]))
        for a in names if cluster.get(nn[a]) != cluster.get(a)]
for r in sorted(rows, key=lambda t: -t[4])[:20]:
    print('  %-24s %-4s -> %-24s %-4s  %.3f' % r)
json.dump({'covered': names, 'crossLineageNeighbours': rows},
          open(os.path.join(EXT, 'vector-check.json'), 'w'), indent=1)
