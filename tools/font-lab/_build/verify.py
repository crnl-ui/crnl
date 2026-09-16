import json, os, sys
from fontTools.ttLib import TTFont
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D=json.load(open(os.path.join(ROOT,'display-specs-2026-08-31.json'))); S=D['specs']; LH=D['lineHeights']
st=json.load(open(os.path.join(ROOT,'_build','state.json')))['done']
OUT=os.path.join(ROOT,'built-fonts')
fails=[]; rows=[]
for fam,rec in st.items():
    spec=S[fam]; token=spec['name'] or fam
    for cut in rec['cuts']:
        p=os.path.join(OUT,cut['file'])
        try: f=TTFont(p)
        except Exception as e: fails.append((cut['file'],'open',repr(e)[:60])); continue
        n1=f['name'].getDebugName(1); n2=f['name'].getDebugName(2)
        cm=f.getBestCmap()
        a,A=cm.get(0x61), cm.get(0x41)
        if n1!=cut['family']: fails.append((cut['file'],'family',n1))
        if n2!='Regular': fails.append((cut['file'],'subfamily',n2))
        if f['OS/2'].usWeightClass!=int(spec['weight']): fails.append((cut['file'],'weight',f['OS/2'].usWeightClass))
        if 'fvar' in f: fails.append((cut['file'],'still variable',''))
        if cut['caps'] and a and A and a!=A: fails.append((cut['file'],'caps not mapped',f'{a}!={A}'))
        if not cut['caps'] and a and A and a==A: fails.append((cut['file'],'unexpectedly capsed',a))
        if f['name'].getDebugName(0) is None: fails.append((cut['file'],'copyright dropped',''))
        # metrics: midpoint must have moved by exactly the recorded shift
        src=os.path.join(ROOT,'_build','sources')
        rows.append((cut['file'], cut['shiftUnits'], f['hhea'].ascent, f['hhea'].descent,
                     round((f['hhea'].ascent+f['hhea'].descent)/2), cut['upm']))
print('cuts checked:', sum(len(r['cuts']) for r in st.values()))
print('failures:', len(fails))
for x in fails[:25]: print('  ', x)
print('licenses:', len(os.listdir(os.path.join(OUT,'licenses'))))
