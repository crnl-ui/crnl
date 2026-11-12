#!/usr/bin/env python3
"""Fixtures for the Ussher prototypes. Writes data/*.js (plain scripts, so pages open from file://).

  calendar  build/calendar-from-core.json — dumped from the real Kotlin core
            (LiturgicalCalendar.day over 2026-11-01..2027-12-31). Real data.
  office    structure read from ussher/content/bcp1928/offices/morning-prayer.yaml
            (sections, block ids, types, choices, `when`). Real structure.
            Every TEXT is lorem ipsum: Ussher hard rule 1 forbids liturgical
            text that is not transcribed from the source printing. Citations,
            psalm numbers and page numbers are placeholders too.

Run:  python3 prototypes/ussher/build/make_fixtures.py [path/to/ussher]
"""
import json, os, random, sys, yaml

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'data')
USSHER = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, '..', '..', '..', '..', 'ussher')

WORDS = ('lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut '
         'labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris '
         'nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse '
         'cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui '
         'officia deserunt mollit anim id est laborum').split()
rng = random.Random(1928)

def words(n):
    return ' '.join(rng.choice(WORDS) for _ in range(n))

def sentence(lo=6, hi=16):
    w = words(rng.randint(lo, hi))
    if rng.random() < .5:
        parts = w.split(); i = rng.randint(2, max(2, len(parts) - 2))
        w = ' '.join(parts[:i]) + ', ' + ' '.join(parts[i:])
    return w[0].upper() + w[1:] + rng.choice(['.', '.', '.', ';', ':'])

def para(n):
    s = ' '.join(sentence() for _ in range(n))
    return s[:-1] + '.'

def half():
    w = words(rng.randint(4, 9)); return w[0].upper() + w[1:]

def verses(n):
    return [{'n': i + 1, 'a': half() + rng.choice([',', ';', ':']), 'b': half().lower() + '.'} for i in range(n)]

def title_from_id(i):
    return ' '.join(p.capitalize() for p in i.split('-'))

page = [2]
def src():
    page[0] += rng.choice([0, 0, 1])
    return {'book': 'bcp1928', 'page': page[0], 'placeholder': True}

def option_block(opt):
    """What a Choice option resolves to. Core returns only the id today."""
    if opt.startswith('sentence'):
        return {'type': 'sentence', 'text': para(1), 'citation': 'Book 0. 0'}
    if 'creed' in opt:
        return {'type': 'prayer', 'text': para(7), 'amen': True}
    return {'type': 'canticle', 'canticle': opt, 'title': title_from_id(opt), 'verses': verses(rng.randint(8, 14))}

def lesson(n):
    paras, v = [], 1
    for _ in range(3):
        p = []
        for _ in range(rng.randint(3, 6)):
            p.append({'v': v, 'text': sentence(10, 24)}); v += 1
        paras.append(p)
    return {'citation': f'Book {n}. 1–{v - 1}', 'translation': 'KJV', 'translationName': 'King James Version',
            'fallback': n == 1, 'fallbackNote': 'Shown from the King James Version: the chosen Bible lacks this book.' if n == 1 else None,
            'paragraphs': paras}

def fill(block):
    t = block['type']; b = dict(block)
    b.pop('note', None); page_ = b.pop('page', None)
    b['source'] = src()
    if t in ('heading',): b['text'] = title_from_id(b['id'])
    elif t == 'rubric': b['text'] = para(rng.choice([1, 1, 2]))
    elif t == 'sentence': b['text'] = para(1); b['citation'] = 'Book 0. 0'
    elif t == 'prayer': b['text'] = para(rng.randint(3, 7)); b['title'] = title_from_id(b['id'])
    elif t == 'versicles':
        n = max(len(b.get('lines', [])), 6)
        b['lines'] = [{'speaker': 'officiant' if i % 2 == 0 else 'people', 'text': sentence(4, 10)} for i in range(n)]
    elif t == 'canticle':
        b['title'] = title_from_id(b['canticle']); b['verses'] = verses(2 if b['canticle'] == 'gloria-patri' else 11)
    elif t == 'choice':
        b['options'] = [{'id': o, 'title': title_from_id(o), 'block': option_block(o)} for o in b['options']]
    elif t == 'slot':
        f = b['fill']
        if f == 'psalms':
            b['psalms'] = [{'number': '00', 'title': 'Psalm 00', 'incipit': words(2).capitalize(), 'verses': verses(k)} for k in (9, 14)]
            b['appointed'] = 'Day 12 · Morning'
        elif f in ('first-lesson', 'second-lesson'):
            b['lesson'] = lesson(1 if f == 'first-lesson' else 2)
        elif f == 'collect-of-the-day':
            b['collect'] = {'title': 'The Collect of the Day', 'text': para(3), 'amen': True}
    return b

def office():
    y = yaml.safe_load(open(os.path.join(USSHER, 'content/bcp1928/offices/morning-prayer.yaml')))
    secs = [{'id': s['id'], 'title': s['title'], 'blocks': [fill(b) for b in s['blocks']]} for s in y['sections']]
    return {'book': y['book'], 'office': y['office'], 'title': y['title'], 'date': TODAY,
            'placeholderText': True, 'sections': secs}

TODAY = '2026-11-12'

SETTINGS = {   # options named in ussher/docs/PLAN.md; defaults as decided there
    'book': {'value': 'bcp1928', 'options': [
        {'id': 'bcp1928', 'title': '1928 Book of Common Prayer', 'available': True},
        {'id': 'bcp1662', 'title': '1662 Book of Common Prayer', 'available': False},
        {'id': 'bcp1979', 'title': '1979 Book of Common Prayer', 'available': False}]},
    'bible': {'value': 'kjv', 'options': [
        {'id': 'kjv', 'title': 'King James Version'}, {'id': 'geneva', 'title': 'Geneva Bible'},
        {'id': 'asv', 'title': 'American Standard Version'}, {'id': 'bsb', 'title': 'Berean Standard Bible'},
        {'id': 'web', 'title': 'World English Bible Updated'}, {'id': 'webbe', 'title': 'World English Bible British Edition'}]},
    'officiant': {'value': 'lay', 'options': [{'id': 'lay', 'title': 'Lay reader'}, {'id': 'priest', 'title': 'Priest'}]},
    'textSize': {'value': 17, 'min': 14, 'max': 24, 'unit': 'pt'},
    'reminders': {'morning': {'on': True, 'time': '07:00'}, 'evening': {'on': False, 'time': '18:00'}},
    'showSourcePages': {'value': False},
    'appearance': {'value': 'system', 'options': [{'id': 'system', 'title': 'System'}, {'id': 'light', 'title': 'Light'}, {'id': 'dark', 'title': 'Dark'}]},
}

def write(name, var, obj):
    with open(os.path.join(OUT, name), 'w') as f:
        f.write('/* GENERATED by build/make_fixtures.py — do not edit. */\n')
        f.write(f'window.USSHER = window.USSHER || {{}};\nwindow.USSHER.{var} = ')
        json.dump(obj, f, ensure_ascii=False, indent=1); f.write(';\n')

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    cal = json.load(open(os.path.join(HERE, 'calendar-from-core.json')))
    write('calendar.js', 'calendar', {'today': TODAY, 'book': 'bcp1928', 'precedenceResolved': False, 'days': cal})
    write('office.js', 'office', office())
    write('settings.js', 'settings', SETTINGS)
    write('psalter.js', 'psalter', {'placeholderText': True, 'count': 150,
          'psalms': [{'number': n, 'incipit': words(2).capitalize(), 'verseCount': rng.randint(5, 40)} for n in range(1, 151)],
          'sample': {'number': 1, 'verses': verses(12)}})
    print('wrote', sorted(os.listdir(OUT)))
