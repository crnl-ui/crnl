#!/usr/bin/env python3
"""Tier 1 of the paid-font index: hand-assigned, one line each.

Every entry here is a family I can make a structural argument about, placed into one
of the 47 lineages from font-match-research.md. Confidence follows that document's
scale, and it is deliberately conservative:

  high   — a real structural or historical argument, not just a shared category
  medium — same family behaviour or an adjacent genre
  loose  — search direction only

`library` says where you would get it, which is usually the first practical question:
  adobe    — included with a Creative Cloud subscription
  monotype — Monotype Fonts subscription
  retail   — buy direct from the foundry
  bundled  — ships with an OS or another product

Tier 2 (see make_paid_index.py) is harvested catalogue names with no such argument
behind them. It exists so a search resolves, and it is labelled as routing only.
"""

# name: (cluster, confidence, foundry, library, note)
TIER1 = {
# ── S01 neutral neo-grotesk UI sans ─────────────────────────────────────────
'Helvetica': ('S01','high','Linotype','monotype','The reference neo-grotesk; closed apertures, horizontal terminals.'),
'Helvetica Neue': ('S01','high','Linotype','monotype','Rationalised Helvetica with a consistent width and weight system.'),
'Helvetica Now': ('S01','high','Monotype','monotype','Modern three-optical-size rebuild of Helvetica.'),
'Neue Haas Grotesk': ('S01','high','Monotype','adobe','Schwartz’s restoration of the pre-Helvetica original; the most faithful of the family.'),
'Akzidenz-Grotesk': ('S01','high','Berthold','retail','The 19th-century grotesk Helvetica was drawn against.'),
'Söhne': ('S01','high','Klim','retail','Neue Haas by way of 1980s Swiss signage; the current default for this look.'),
'Untitled Sans': ('S01','high','Klim','retail','Deliberately plain grotesk built from ordinary reference material.'),
'Aeonik': ('S01','medium','CoType','retail','Geometric-leaning neutral sans; between this and the Gotham lineage.'),
'Suisse Int’l': ('S01','high','Swiss Typefaces','retail','Tight, cool Swiss grotesk in the Helvetica line.'),
'Inter': ('S01','high','Rasmus Andersson','adobe','Open-source UI grotesk tuned for screens; already in your library.'),
'Roboto': ('S01','medium','Google','adobe','Grotesk skeleton with humanist curves; Android’s system face.'),
'Arial': ('S01','high','Monotype','bundled','Helvetica-metric grotesk with humanist terminal cuts.'),
'Univers': ('S01','high','Linotype','monotype','Frutiger’s systematic grotesk; the origin of numbered width systems.'),
'Univers Next': ('S01','high','Linotype','monotype','Current digital Univers, with the numbering preserved.'),
'Monotype Grotesque': ('S01','medium','Monotype','monotype','Idiosyncratic early grotesk; less even than Helvetica.'),
'Nimbus Sans': ('S01','medium','URW','retail','Helvetica-metric clone; useful where licensing forbids the original.'),
'Unica': ('S01','high','Lineto','retail','Deliberate synthesis of Helvetica and Univers.'),
'Zurich': ('S01','medium','Bitstream','retail','Univers-metric alternative.'),
'Post Grotesk': ('S01','medium','Sharp Type','retail','Contemporary grotesk with a slightly warmer skeleton.'),
'Residence Grotesque': ('S01','medium','Sharp Type','retail','Neutral grotesk with subtle idiosyncrasy in the details.'),
'Die Grotesk': ('S01','medium','Klim','retail','Contemporary grotesk with a display-weighted range.'),
'Neue Montreal': ('S01','medium','Pangram Pangram','retail','Widely used neutral grotesk in brand work.'),

# ── S02 utilitarian humanist sans ───────────────────────────────────────────
'Frutiger': ('S02','high','Linotype','monotype','The signage humanist: open apertures, generous counters.'),
'Frutiger Neue': ('S02','high','Linotype','monotype','Current Frutiger with an extended weight range.'),
'Myriad': ('S02','high','Adobe','adobe','Adobe’s humanist workhorse; open and unfussy.'),
'Segoe UI': ('S02','medium','Microsoft','bundled','Frutiger-descended UI face; Windows’ system sans.'),
'Syntax': ('S02','high','Linotype','monotype','Humanist sans drawn with the tension of a serif roman.'),
'FF Meta': ('S02','high','FontFont','adobe','Spiekermann’s humanist workhorse for small sizes.'),
'FF Meta Serif': ('R06','medium','FontFont','adobe','Slab-serif companion to FF Meta.'),
'FF Unit': ('S02','high','FontFont','adobe','Meta rationalised into a cleaner, more neutral grotesk.'),
'ITC Officina Sans': ('S02','medium','ITC','adobe','Office-typewriter humanist with sturdy joins.'),
'Fira Sans': ('S02','high','Mozilla / Carrois','adobe','Humanist UI sans with a very wide weight range.'),
'IBM Plex Sans': ('S02','high','IBM','adobe','Corporate humanist grotesk with engineered details.'),
'Lato': ('S02','medium','Łukasz Dziedzic','adobe','Warm humanist sans, very widely deployed.'),
'Open Sans': ('S02','medium','Steve Matteson','adobe','Neutral humanist UI face descended from Droid.'),
'Source Sans Pro': ('S02','high','Adobe','adobe','Adobe’s open humanist sans, News Gothic informed.'),
'Skolar Sans': ('S02','medium','Rosetta','retail','Humanist sans with broad script coverage.'),
'PT Sans': ('S02','medium','ParaType','adobe','Humanist sans with strong Cyrillic.'),
'Thesis Sans': ('S02','medium','LucasFonts','retail','Large humanist superfamily.'),
'FF Dax': ('S12','medium','FontFont','adobe','Narrow humanist sans with a distinct condensed voice.'),
'Optima': ('R08','high','Linotype','monotype','Flared glyphic sans; sits with inscriptional letterforms, not grotesks.'),
'Optima Nova': ('R08','high','Linotype','monotype','Revised Optima with a proper italic.'),

# ── S03 American grotesk and editorial sans ─────────────────────────────────
'Franklin Gothic': ('S03','high','ITC / Monotype','adobe','The American gothic; sturdy, slightly irregular.'),
'News Gothic': ('S03','high','Monotype','adobe','Lighter Benton gothic built for newspaper text.'),
'Trade Gothic': ('S03','high','Linotype','monotype','Warmer, more irregular American gothic; a newsroom staple.'),
'Trade Gothic Next': ('S03','high','Linotype','adobe','Current Trade Gothic with a fuller width and weight system.'),
'Acumin': ('S03','high','Adobe','adobe','Neutral American grotesk superfamily across widths and weights.'),
'GT America': ('S03','high','Grilli Type','retail','Explicit American-gothic and Swiss-grotesk hybrid across six widths.'),
'Graphik': ('S03','high','Commercial Type','retail','Plain editorial grotesk; the magazine default of the last decade.'),
'Benton Gothic': ('S03','high','Font Bureau','retail','Digitisation of the original ATF gothics.'),
'Benton Sans': ('S03','high','Font Bureau','retail','Benton Gothic rebuilt as a broad editorial system.'),
'Griffith Gothic': ('S03','high','Frere-Jones','retail','Revival of Ionic-era news gothic with tight fit.'),
'Interstate': ('S09','high','Frere-Jones','adobe','Drawn from US highway signage; sits with the industrial signage faces.'),
'Amplitude': ('S03','medium','Font Bureau','retail','News gothic engineered for small sizes and rough printing.'),
'Whitney': ('S03','high','Hoefler&Co','retail','Wayfinding gothic with humanist warmth; a museum-signage staple.'),
'Ideal Sans': ('S03','medium','Hoefler&Co','retail','Hand-drawn humanist gothic; softer than Whitney.'),
'Mallory': ('S03','medium','Frere-Jones Type','retail','American-British hybrid gothic.'),
'Atlas': ('S03','medium','Commercial Type','retail','Grotesk with a mid-century American cast.'),
'Archivo': ('S03','high','Omnibus Type','adobe','Open grotesk on the American editorial model; already in your library.'),
'Libre Franklin': ('S03','high','Impallari','adobe','Open Franklin Gothic interpretation; already in your library.'),
'Nobel': ('S03','medium','Font Bureau','retail','Dutch geometric-leaning gothic.'),
'Bell Gothic': ('S03','high','Linotype','monotype','Phone-directory gothic; extremely economical.'),
'Bell Centennial': ('S03','high','Linotype','monotype','Matthew Carter’s replacement for Bell Gothic.'),
'Ringside': ('S03','medium','Hoefler&Co','retail','Gothic family with distinct optical sizes for signage.'),

# ── S04 Gotham-like geometric sans ──────────────────────────────────────────
'Gotham': ('S04','high','Hoefler&Co','retail','The reference: New York architectural lettering made systematic.'),
'Gotham Rounded': ('S06','high','Hoefler&Co','retail','Rounded-terminal Gotham; sits with the soft sans.'),
'Proxima Nova': ('S04','high','Mark Simonson','adobe','Geometric skeleton with grotesk proportions; the web’s Gotham stand-in.'),
'Circular': ('S04','high','Lineto','retail','Warm geometric sans; the branding default of the 2010s.'),
'Brandon Grotesque': ('S04','high','HVD','adobe','1920s geometric with a small x-height and soft finish.'),
'Sofia Pro': ('S04','medium','Mostardesign','adobe','Rounded geometric sans, widely licensed.'),
'Montserrat': ('S04','high','Julieta Ulanovsky','adobe','Buenos Aires signage geometric; already in your library.'),
'Poppins': ('S04','high','Indian Type Foundry','adobe','Strictly geometric monolinear sans; already in your library.'),
'Centra No.1': ('S04','medium','Sharp Type','retail','Geometric sans with a sharpened, contemporary finish.'),
'Centra No.2': ('S04','medium','Sharp Type','retail','Wider-aperture companion to Centra No.1.'),
'GT Walsheim': ('S04','high','Grilli Type','retail','Geometric sans with hand-drawn irregularity.'),
'Sharp Sans': ('S04','high','Sharp Type','retail','Geometric sans built for brand systems.'),
'Beatrice Standard': ('S11','medium','Sharp Type','retail','Contemporary sans with deliberately odd proportions.'),
'Halyard': ('S04','medium','Darden Studio','adobe','Geometric-humanist hybrid across three optical widths.'),
'Termina': ('S10','medium','Fontfabric','adobe','Squared geometric with a technical cast.'),
'Geograph': ('S02','medium','Klim','retail','Humanist sans drawn for small-size legibility.'),
'Calibre': ('S04','high','Klim','retail','Geometric sans with squared-off terminals.'),
'Metric': ('S09','high','Klim','retail','Geometric sans from Berlin signage lettering.'),
'Karbon': ('S04','medium','Klim','retail','Technical geometric sans.'),
'Century Gothic': ('S05','high','Monotype','monotype','Monoline geometric on the Futura model.'),

# ── S05 Futura and Avant Garde lineage ──────────────────────────────────────
'Futura': ('S05','high','Bauer / Neufville','monotype','The Bauhaus geometric; circular bowls, pointed apexes.'),
'Futura PT': ('S05','high','ParaType','adobe','Widely licensed Futura with a full weight range.'),
'ITC Avant Garde Gothic': ('S05','high','ITC','adobe','Geometric with the famous tight-fitting ligatures.'),
'Kabel': ('S05','high','Linotype','monotype','Koch’s geometric with an idiosyncratic humanist streak.'),
'Twentieth Century': ('S05','high','Monotype','monotype','Monotype’s answer to Futura.'),
'Bauhaus': ('S05','medium','ITC','adobe','Geometric derived from Bayer’s universal alphabet.'),
'Neuzeit S': ('S05','medium','Linotype','monotype','Geometric grotesk hybrid used for signage.'),
'GT Eesti': ('S05','medium','Grilli Type','retail','Geometric sans with a Soviet-era reference.'),

# ── S06 soft and rounded sans ───────────────────────────────────────────────
'VAG Rounded': ('S06','high','Linotype','adobe','Volkswagen’s rounded grotesk; the reference rounded sans.'),
'Proxima Soft': ('S06','high','Mark Simonson','adobe','Rounded Proxima Nova.'),
'Haboro Soft': ('S06','medium','InsigneDesign','adobe','Rounded slab-sans with a soft finish.'),
'GT Maru': ('S06','medium','Grilli Type','retail','Rounded sans built from a circular pen.'),
'Omnes': ('S06','medium','Darden Studio','adobe','Soft rounded humanist sans.'),

# ── S07 condensed poster grotesk ────────────────────────────────────────────
'Knockout': ('S07','high','Hoefler&Co','retail','Nine widths of wood-type gothic; the sports-poster reference.'),
'Druk': ('S07','high','Commercial Type','retail','Extreme-contrast condensed display gothic.'),
'Druk Condensed': ('S07','high','Commercial Type','retail','The narrower Druk cuts.'),
'Tungsten': ('S07','high','Hoefler&Co','retail','Compact condensed gothic built for headlines and scoreboards.'),
'Champion Gothic': ('S07','high','Hoefler&Co','retail','Six wood-type condensed cuts named after boxing weights.'),
'Titling Gothic': ('S07','high','Font Bureau','retail','Very large condensed gothic width-and-weight matrix.'),
'Acumin Condensed': ('S07','high','Adobe','adobe','The condensed widths of the Acumin system.'),
'Trade Gothic Condensed': ('S07','high','Linotype','monotype','The condensed Trade Gothic cuts; a newsroom and sports standard.'),
'Compacta': ('S07','high','Letraset','monotype','Very tight condensed grotesk from the Letraset era.'),
'Haettenschweiler': ('S07','high','Monotype','bundled','Extremely condensed poster gothic.'),
'Impact': ('D06','high','Monotype','bundled','Ultra-heavy poster gothic; heavier than it is condensed.'),
'Agency FB': ('S07','medium','Font Bureau','adobe','Geometric condensed titling face.'),
'Garage Gothic': ('S07','high','Frere-Jones','retail','Condensed gothic drawn from parking-garage tickets.'),
'Sharp Sans Condensed': ('S07','medium','Sharp Type','retail','Condensed cuts of Sharp Sans.'),
'Mānuka': ('D06','high','Klim','retail','Very heavy display sans with a New Zealand wood-type feel.'),
'Conductor': ('S07','medium','Frere-Jones Type','retail','Condensed display gothic in many widths.'),
'National': ('S03','high','Klim','retail','Grotesk with American gothic proportions.'),
'National 2': ('S03','high','Klim','retail','Rebuilt National with a wider range.'),

# ── S08 width-system sans superfamilies ─────────────────────────────────────
'Acumin family': ('S08','high','Adobe','adobe','Ninety cuts across four widths and five optical weights.'),
'GT America Intl': ('S08','high','Grilli Type','retail','GT America extended for non-Latin scripts.'),
'Sharp Grotesk': ('S08','high','Sharp Type','retail','One of the largest width systems in retail type.'),
'Roboto Flex': ('S08','high','Google','adobe','Variable superfamily with width, weight and optical size; in your library.'),
'Helvetica Now Variable': ('S08','medium','Monotype','monotype','Variable Helvetica across width and optical size.'),

# ── S09 DIN and industrial sans ─────────────────────────────────────────────
'FF DIN': ('S09','high','FontFont','adobe','The retail DIN; engineered curves and compact rhythm.'),
'FF DIN Paneuropean': ('S09','high','FontFont','adobe','FF DIN with extended script coverage.'),
'DIN 1451': ('S09','high','German standards','retail','The original signage standard the whole lineage descends from.'),
'DIN Next': ('S09','high','Monotype','monotype','Monotype’s DIN with a wider range and rounded variants.'),
'Klavika': ('S09','high','Process Type','retail','Squared industrial sans; Facebook’s former brand face.'),
'Industry': ('S10','medium','Fort Foundry','adobe','Tough squared display sans.'),
'Utility Pro': ('S09','medium','Adobe','adobe','Industrial signage sans with a utilitarian finish.'),
'Transport': ('S09','high','UK road signs','retail','British road signage alphabet.'),
'Highway Gothic': ('S09','high','FHWA','retail','US highway signage alphabet.'),
'Rail Alphabet': ('S09','high','Kinneir Calvert','retail','British Rail signage face.'),
'GT Pressura': ('S09','medium','Grilli Type','retail','Industrial sans drawn from stencilled packaging.'),
'FF Oxide': ('D07','medium','FontFont','adobe','Stencil-cut industrial display face.'),

# ── S10 techno square and futuristic display ────────────────────────────────
'Eurostile': ('S10','high','Nebiolo / Linotype','monotype','Squared bowls and wide capitals; the reference techno face.'),
'Eurostile Next': ('S10','high','Linotype','monotype','Current Eurostile with a fuller range.'),
'Microgramma': ('S10','high','Nebiolo','monotype','Eurostile’s caps-only predecessor.'),
'Bank Gothic': ('S10','high','Lanston / Monotype','adobe','Sparse squared caps; a sports and film-title staple.'),
'Handel Gothic': ('S10','medium','ITC','adobe','Rounded-square display sans of the 1960s.'),
'Industry Inc': ('S10','medium','Fort Foundry','adobe','Inline and stencil variants of Industry.'),
'GT Zirkon': ('S11','medium','Grilli Type','retail','Grotesk with deliberately awkward, technical details.'),

# ── S11 contemporary quirky grotesk ─────────────────────────────────────────
'Maelstrom': ('S11','medium','Klim','retail','Display grotesk with wilful, high-contrast details.'),
'GT Flexa': ('S11','medium','Grilli Type','retail','Grotesk with an exaggerated variable width.'),
'Simula': ('S11','medium','Sharp Type','retail','Serif-grotesk hybrid with deliberate distortion.'),
'Doyle': ('S11','medium','Sharp Type','retail','Contemporary sans with irregular, drawn details.'),
'Local Gothic': ('S11','loose','Christian Schwartz','retail','Deliberately mismatched gothic, sampled from many sources.'),

# ── S12 light geometric and narrow modernist sans ───────────────────────────
'Neutraface': ('S12','high','House Industries','retail','Neutra-derived geometric with a very small x-height.'),
'Neutraface Display': ('S12','high','House Industries','retail','The display cuts, with the tightest proportions.'),
'Gilroy': ('S12','medium','Radomir Tinkov','retail','Geometric sans with a wide weight range.'),
'GT Sectra': ('R05','medium','Grilli Type','retail','Broad-nib serif with calligraphic cuts.'),

# ── R01 Garamond and Renaissance book serif ─────────────────────────────────
'Garamond Premier': ('R01','high','Adobe','adobe','Slimbach’s Garamond from Granjon’s originals.'),
'Adobe Garamond': ('R01','high','Adobe','adobe','The widely licensed Garamond revival.'),
'Minion': ('R01','high','Adobe','adobe','Neutral, systematic Renaissance serif.'),
'Minion 3': ('R01','high','Adobe','adobe','Current Minion with a broader range.'),
'Sabon': ('R01','high','Linotype','monotype','Tschichold’s Garamond for machine composition.'),
'Bembo': ('R01','high','Monotype','monotype','Aldine roman; the model for much book typography.'),
'Centaur': ('R01','high','Monotype','monotype','Rogers’s Jenson revival.'),
'Adobe Jenson': ('R01','high','Adobe','adobe','Venetian oldstyle with a strong calligraphic stress.'),
'Granjon': ('R01','high','Linotype','monotype','Garamond revival with a smaller x-height.'),
'Lyon Text': ('R01','high','Commercial Type','retail','Contemporary Renaissance serif for editorial text.'),
'Galliard': ('R01','high','Carter & Cone','adobe','Granjon-derived roman with sharp, energetic serifs.'),
'Heldane': ('R01','high','Klim','retail','Contemporary Renaissance serif with display cuts.'),
'Newzald': ('R01','medium','Klim','retail','Oldstyle with a Dutch bite.'),
'Trinité': ('R01','high','Enschedé','retail','Van Blokland’s Renaissance serif with three descender lengths.'),
'Arno': ('R01','high','Adobe','adobe','Slimbach’s humanist book serif.'),

# ── R02 Caslon and English oldstyle ─────────────────────────────────────────
'Adobe Caslon': ('R02','high','Adobe','adobe','The standard Caslon revival.'),
'Williams Caslon Text': ('R02','high','Font Bureau','retail','Caslon rebuilt for contemporary text setting.'),
'King’s Caslon': ('R02','high','Dalton Maag','adobe','Caslon for display and text with a modern finish.'),
'Big Caslon': ('R02','high','Carter & Cone','bundled','Caslon’s display sizes, where the quirks belong.'),
'Caslon': ('R02','high','various','monotype','The English oldstyle original.'),

# ── R03 Baskerville, Scotch and transitional ────────────────────────────────
'Baskerville': ('R03','high','Monotype','monotype','The transitional reference; vertical stress, crisp contrast.'),
'Miller': ('R03','high','Carter & Cone','retail','Scotch roman for newspapers and books.'),
'Miller Text': ('R03','high','Carter & Cone','adobe','The text cuts of Miller.'),
'Miller Display': ('R04','high','Carter & Cone','adobe','Miller’s high-contrast display sizes.'),
'Tiempos Text': ('R03','high','Klim','retail','Times reworked for contemporary editorial setting.'),
'Tiempos Headline': ('R04','high','Klim','retail','The high-contrast display cuts of Tiempos.'),
'Times New Roman': ('R03','high','Monotype','bundled','The newspaper transitional everyone knows.'),
'Plantin': ('R03','high','Monotype','monotype','Sturdy oldstyle-transitional; Times’s direct ancestor.'),
'Georgia': ('R03','high','Microsoft','bundled','Scotch roman drawn for screens.'),
'Financier': ('R03','high','Klim','retail','Newspaper serif with sharp, economical details.'),
'Publico': ('R03','high','Commercial Type','retail','Editorial serif system across text and display.'),
'Farnham': ('R03','high','Font Bureau','retail','Fleischmann-derived transitional with lively details.'),
'Utopia': ('R03','high','Adobe','adobe','Transitional serif drawn for digital production.'),
'Charter': ('R03','medium','Bitstream','adobe','Economical transitional built for low-resolution output.'),
'Kepler': ('R03','high','Adobe','adobe','Modern-face serif with optical sizes.'),

# ── R04 high-contrast editorial display serif ───────────────────────────────
'Didot': ('R04','high','Linotype','monotype','The French modern face; hairline serifs, extreme contrast.'),
'Bodoni': ('R04','high','various','monotype','The Italian modern face.'),
'Bauer Bodoni': ('R04','high','Bauer','monotype','The sharpest and most delicate Bodoni.'),
'Canela': ('R04','high','Commercial Type','retail','Serif-to-flare display face for magazine covers.'),
'Ogg': ('R04','high','Sharp Type','retail','Calligraphic display serif drawn from hand-lettered book jackets.'),
'Chronicle Display': ('R04','high','Hoefler&Co','retail','Scotch display serif in four grades.'),
'Domaine Display': ('R04','high','Klim','retail','High-contrast display serif with sharp bracketing.'),
'IvyPresto Display': ('R04','high','IvyFoundry','adobe','Didone display with fine hairlines.'),
'Playfair Display': ('R04','high','Claus Eggers Sørensen','adobe','Open high-contrast display serif; already in your library.'),
'Quarto': ('R04','high','Hoefler&Co','retail','Renaissance-derived display serif with sharp entry strokes.'),
'Portrait': ('R04','high','Commercial Type','retail','Display serif with a sixteenth-century French reference.'),
'Le Jeune': ('R04','high','Commercial Type','retail','Fashion-magazine didone across optical sizes.'),

# ── R05 contemporary soft display serif ─────────────────────────────────────
'Recoleta': ('R05','high','Latinotype','adobe','Soft 1970s-flavoured serif; the current branding favourite.'),
'Bookmania': ('R05','high','Mark Simonson','adobe','Bookman revival with the swash range intact.'),
'Souvenir': ('R05','high','ITC','adobe','The soft 1970s serif.'),
'Chantal': ('R05','medium','Adobe','adobe','Soft contemporary display serif.'),
'Beatrice Display': ('R04','medium','Sharp Type','retail','Contrast-heavy display serif-sans hybrid.'),
'Signifier': ('R05','medium','Klim','retail','Serif with a deliberately eroded, drawn quality.'),
'Epicene': ('R04','high','Klim','retail','Display serif with an eighteenth-century English reference.'),

# ── R06 text slab and contemporary Egyptian ─────────────────────────────────
'Adelle': ('R06','high','TypeTogether','adobe','Slab superfamily built for newspaper text.'),
'Chaparral': ('R06','high','Adobe','adobe','Humanist slab with a soft, readable finish.'),
'Rockwell': ('R06','high','Monotype','monotype','Geometric slab; blunt and even.'),
'Rockwell Nova': ('R06','high','Monotype','monotype','Current Rockwell with a fuller range.'),
'Sentinel': ('R06','high','Hoefler&Co','retail','Clarendon-derived slab that works at text sizes.'),
'Archer': ('R06','high','Hoefler&Co','retail','Ball-terminal slab; friendlier than Sentinel.'),
'Clarendon': ('R06','high','Monotype','monotype','The bracketed Egyptian everything else references.'),
'Stag': ('R06','high','Commercial Type','retail','Tight, sharp slab drawn for magazine headlines.'),
'Vitesse': ('S10','medium','Hoefler&Co','retail','Squared slab with a technical feel.'),
'Guardian Egyptian': ('R06','high','Commercial Type','retail','The newspaper slab system.'),
'Freight': ('R06','medium','Darden Studio','adobe','Large slab-to-serif superfamily.'),
'Serifa': ('R06','high','Linotype','monotype','Univers with slab serifs attached.'),
'Memphis': ('R06','high','Linotype','monotype','1930s geometric slab.'),
'Sharp Slab': ('R06','medium','Sharp Type','retail','Contemporary slab with sharp cut serifs.'),

# ── R07 collegiate and heavy display slab ───────────────────────────────────
'Sutro': ('R07','high','Parkinson','adobe','Fat Victorian display slab with shaded variants.'),
'ITC Benguiat': ('R07','high','ITC','adobe','Art Nouveau-inflected display serif.'),
'Cheltenham': ('R07','medium','ITC','adobe','Sturdy American display serif.'),
'Abolition': ('R07','medium','Fort Foundry','adobe','Condensed collegiate slab.'),

# ── R08 inscriptional and glyphic serif ─────────────────────────────────────
'Trajan': ('R08','high','Adobe','adobe','Roman inscriptional capitals; the movie-poster face.'),
'Albertus': ('R08','high','Monotype','monotype','Glyphic with flared, chiselled terminals.'),
'Friz Quadrata': ('R08','high','ITC','adobe','Glyphic serif with sharply cut terminals.'),
'Perpetua': ('R08','high','Monotype','monotype','Gill’s inscriptional roman.'),
'Copperplate Gothic': ('R08','high','Monotype','adobe','Tiny-serifed engraving capitals.'),

# ── D06 heavy geometric poster sans ─────────────────────────────────────────
'Acumin Black': ('D06','high','Adobe','adobe','The heaviest Acumin cuts.'),
'Obviously': ('D06','medium','OH no Type','retail','Display sans across a wide width and weight matrix.'),
'Monument Extended': ('D06','high','Pangram Pangram','retail','Very wide heavy display sans; a sports-brand staple.'),
'Archivo Black': ('D06','high','Omnibus Type','adobe','Heavy grotesk; already in your library.'),
'GT Super': ('R04','medium','Grilli Type','retail','1970s-flavoured display serif across optical sizes.'),

# ── D07 sports, stencil and industrial display ──────────────────────────────
'Brothers': ('D07','high','Emigre','retail','Athletic block lettering with stencil cuts.'),
'Rig Solid': ('D07','medium','Jamie Clarke','retail','Layered wood-type display with shadow and inline.'),
'Idlewild': ('D07','medium','Hoefler&Co','retail','Wide geometric titling face for signage.'),
'Decimal': ('S10','medium','Hoefler&Co','retail','Watch-dial lettering made into a typeface.'),

# ── D05 soft 1970s and fat-face display ─────────────────────────────────────
'Cooper Black': ('D05','high','various','adobe','The soft fat face; bulbous curves and low counters.'),
'Ohno Fatface': ('D05','high','OH no Type','retail','Contemporary fat face with extreme contrast.'),
'Buffo': ('D05','medium','Adobe','adobe','Rounded fat display serif.'),
'Goodlife': ('D05','medium','Adobe','adobe','Retro display family with multiple layered styles.'),
'Mostra Nuova': ('D04','high','Adobe','adobe','Art Deco geometric display with alternate caps.'),

# ── D04 art deco and geometric period display ───────────────────────────────
'LTC Broadway': ('D04','high','Lanston','adobe','The Art Deco display face.'),
'HWT Geometric': ('D04','medium','Hamilton Wood Type','adobe','Wood-type geometric display.'),
'Area': ('D04','medium','Adobe','adobe','Deco-flavoured geometric display.'),

# ── D03 western and wood type ───────────────────────────────────────────────
'Ponderosa': ('D03','high','Adobe','adobe','Slab-serifed western wood type.'),
'Hamilton Wood Type Collection': ('D03','high','Hamilton','adobe','Digitisations from the Hamilton wood-type museum.'),

# ── D02 blackletter ─────────────────────────────────────────────────────────
'Fette Fraktur': ('D02','high','Linotype','monotype','The heavy German fraktur.'),
'FF Brokenscript': ('D02','high','FontFont','adobe','Contemporary blackletter with a rough edge.'),
'Canela Blackletter': ('D02','medium','Commercial Type','retail','Blackletter drawn with Canela’s flared logic.'),
'Old English Text': ('D02','high','Monotype','monotype','The textura everyone recognises.'),

# ── M01 monospaced code and technical ───────────────────────────────────────
'Operator': ('M01','high','Hoefler&Co','retail','Typewriter-derived mono with a genuine italic.'),
'Operator Mono': ('M01','high','Hoefler&Co','retail','The code-editor cut of Operator.'),
'Nitti': ('M01','high','Bold Monday','adobe','Contemporary mono with a drawn quality.'),
'Pitch': ('M01','high','Klim','retail','Typewriter-referenced mono for text and code.'),
'Input Mono': ('M01','high','Font Bureau','adobe','Highly configurable coding mono.'),
'Source Code Pro': ('M01','high','Adobe','adobe','Adobe’s open coding mono.'),
'IBM Plex Mono': ('M01','high','IBM','adobe','The mono cut of the Plex system.'),
'GT America Mono': ('M01','medium','Grilli Type','retail','Monospaced GT America.'),
'Centra Mono': ('M01','medium','Sharp Type','retail','Monospaced Centra.'),

# ── M02 typewriter, pixel and distressed mono ───────────────────────────────
'Nitti Typewriter': ('M02','high','Bold Monday','adobe','Deliberately inked typewriter mono.'),
'American Typewriter': ('M02','high','ITC','adobe','Softened typewriter slab.'),
'Courier': ('M02','high','various','bundled','The typewriter mono.'),
'Lo-Res': ('M02','high','Emigre','adobe','Bitmap and pixel display family.'),
'P22 Typewriter': ('M02','medium','P22','adobe','Distressed typewriter face.'),
'Prestige Elite': ('M02','high','Linotype','monotype','IBM typewriter face.'),

# ── H03 brush, marker and distressed hand ───────────────────────────────────
'Brush Script': ('H04','high','Monotype','adobe','The connected brush script.'),
'SignPainter': ('H04','high','House Industries','retail','Sign-painter lettering made systematic.'),
'Thirsty Script': ('H04','medium','Yellow Design','adobe','Retro connected script with layered styles.'),
'Sant’Elia Script': ('H04','medium','Yellow Design','adobe','Brush script with rough and layered cuts.'),
'Permanent Marker Pro': ('H03','medium','Adobe','adobe','Marker lettering with a genuine ink edge.'),
'Rock Salt Pro': ('H03','medium','Adobe','adobe','Rough hand lettering.'),
'Felt Tip Roman': ('H03','medium','House Industries','retail','Marker-drawn roman.'),
'Mistral': ('H03','high','Linotype','monotype','Brush-drawn connected script.'),

# ── H05 delicate and formal script ──────────────────────────────────────────
'Bickham Script': ('H05','high','Adobe','adobe','Copperplate engraving script with extensive swashes.'),
'Sloop Script': ('H05','high','Font Bureau','adobe','Formal pointed-pen script in three degrees.'),
'Champion Script': ('H05','high','Monotype','monotype','Formal calligraphic script.'),
'Zapfino': ('H05','high','Linotype','monotype','Zapf’s calligraphic tour de force.'),

# ── H02 comic lettering ─────────────────────────────────────────────────────
'Blambot': ('H02','high','Blambot','retail','The comic-lettering catalogue.'),
'Comicraft': ('H02','high','Comicraft','retail','The other comic-lettering catalogue.'),

# ── D09 psychedelic and experimental ────────────────────────────────────────
'Cheee': ('D09','high','OH no Type','adobe','Variable display face built to distort.'),
'Tomarik': ('D09','medium','Adobe','adobe','Rough-edged display serif and sans.'),
'Digestive': ('D09','high','OH no Type','retail','Wilfully distorted display face.'),
'Eckmannpsych': ('D09','high','OH no Type','retail','Art Nouveau by way of psychedelic poster lettering.'),
'Sharp Earth': ('D09','medium','Sharp Type','retail','Experimental display with an organic distortion.'),
}
