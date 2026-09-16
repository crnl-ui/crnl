#!/usr/bin/env python3
"""Corrections and additions from the lineage audit (see lineage-audit.html).

Three things live here, all traceable to evidence rather than taste:

MOVES        a family whose primary lineage was wrong. Only entered where two
             independent signals agree.
SECONDARY    the schema change the audit argued for. Some faces genuinely belong to
             two lineages and forcing one loses information — Proxima Nova is a
             geometric skeleton on grotesk proportions, and filing it under either
             alone makes searches miss. A secondary lineage is not a hedge; it is
             entered only where the second reading is as defensible as the first.
ADDITIONS    paid families named by the two external sources that the index did not
             cover. Placed from knowledge at the confidence that deserves, which for
             most of them is medium.

Every entry carries its reason. `via` records which signal produced it:
  vector      fontjoy embedding nearest-neighbour result
  external    the frontendresource or similarfont.io mapping
  both        agreed by both
  knowledge   assigned by type knowledge, no external signal
"""

# name: (new primary cluster, via, why)
MOVES = {
 'Khand': ('S07', 'vector',
   'Nearest neighbour is Oswald at 0.875, and Anton’s nearest neighbour is Khand. '
   'Two independent results put it with the condensed poster grotesks, not the DIN industrials.'),
}

# name: (secondary cluster, via, why)
SECONDARY = {
 # ── the geometric / American-grotesk seam ──────────────────────────────────
 'Proxima Nova': ('S03', 'external',
   'Geometric skeleton on grotesk proportions. Our own note says so; the external mapping pairs it with Roboto.'),
 'Graphik': ('S04', 'external',
   'Filed as American editorial grotesk, but plain and geometric enough that the external mapping reaches for Poppins.'),
 'Circular': ('S05', 'external',
   'Geometric sans warm enough to read in the Futura lineage as well.'),
 'Founders Grotesk': ('S01', 'external',
   'American gothic proportions with a neutral Swiss finish.'),
 'Aeonik': ('S04', 'knowledge',
   'Sits between neutral grotesk and geometric; the index note already said as much.'),
 'Calibre': ('S01', 'knowledge', 'Geometric sans with squared terminals and grotesk neutrality.'),
 'Metric': ('S04', 'knowledge', 'Signage geometric that behaves like a DIN in use.'),
 'Neutraface': ('S04', 'knowledge', 'Geometric with a very small x-height; reads with the Gotham lineage at display sizes.'),
 'Interstate': ('S03', 'knowledge', 'Signage face with American gothic bones.'),
 'Optima': ('S02', 'knowledge', 'Flared glyphic, but functions as a humanist sans in text.'),

 # ── width systems are both a lineage and a shape ───────────────────────────
 'GT America': ('S08', 'knowledge', 'Six widths — a width system as much as an American grotesk.'),
 'Acumin': ('S08', 'knowledge', 'Four widths across five optical weights.'),
 'Sharp Grotesk': ('S01', 'knowledge', 'A width system built on a neutral grotesk skeleton.'),
 'Roboto Flex': ('S01', 'knowledge', 'Variable width system on a neo-grotesk skeleton.'),

 # ── the porous slab boundary the audit found (R06 / R07) ───────────────────
 'Bevan': ('R06', 'vector', 'Nearest neighbour is Rokkitt at 0.844, across the heavy-slab boundary.'),
 'Rokkitt': ('R07', 'vector', 'Mirror of the Bevan result; the boundary is crossed in both directions.'),
 'Coustard': ('R07', 'vector', 'Nearest neighbour is Ultra at 0.862.'),
 'Ultra': ('R06', 'vector', 'Mirror of the Coustard result.'),
 'Vitesse': ('R06', 'knowledge', 'Squared slab — technical in feel, Egyptian in construction.'),

 # ── the porous condensed boundary (S07 / S09) ──────────────────────────────
 'Roboto Condensed': ('S07', 'vector',
   'Nearest neighbour is Oswald at 0.843. A condensed editorial grotesk behaves like a poster grotesk.'),
}

# name: (cluster, confidence, foundry, library, note)  — same shape as paid_tier1
ADDITIONS = {
 'Akzidenz Grotesk': ('S01','high','Berthold','retail','Alternate spelling of the Berthold original.'),
 'Aktiv Grotesk': ('S01','high','Dalton Maag','retail','Deliberate middle ground between Helvetica and Univers.'),
 'Apercu': ('S01','high','Colophon','retail','Grotesk with humanist irregularity; a branding staple of the 2010s.'),
 'Apercu Mono': ('M01','high','Colophon','retail','Monospaced Apercu.'),
 'Maison Neue': ('S01','high','Milieu Grotesque','retail','Neutral Swiss grotesk with a technical finish.'),
 'Swiss 721': ('S01','high','Bitstream','retail','Helvetica-metric clone.'),
 'Effra': ('S02','medium','Dalton Maag','retail','Humanist sans drawn from Caslon’s sans capitals.'),
 'Lucida Grande': ('S02','medium','Bigelow & Holmes','bundled','Humanist UI sans; macOS’s former system face.'),
 'Gibson': ('S02','medium','Canada Type','adobe','Humanist sans on a geometric frame.'),
 'Adelle Sans': ('S02','high','TypeTogether','adobe','The sans companion to Adelle.'),
 'Museo Sans': ('S02','medium','exljbris','retail','Semi-geometric humanist sans.'),
 'Museo Sans Rounded': ('S06','medium','exljbris','retail','Rounded Museo Sans.'),
 'Museo': ('R06','medium','exljbris','retail','Slab-serif display family.'),
 'Museo Slab': ('R06','medium','exljbris','retail','The slab cut of the Museo system.'),
 'Avenir': ('S04','high','Linotype','monotype','Geometric humanised — Frutiger’s answer to Futura.'),
 'Avenir Next': ('S04','high','Monotype','monotype','Current Avenir with a fuller range.'),
 'Avenir Next Pro': ('S04','high','Monotype','monotype','The extended Avenir Next release.'),
 'Nexa': ('S04','medium','Fontfabric','retail','Geometric sans widely used in branding.'),
 'Campton': ('S04','medium','René Bieder','retail','Geometric sans on the Futura model.'),
 'Cera Pro': ('S04','medium','TypeMates','retail','Geometric sans with softened joints.'),
 'TT Norms Pro': ('S04','medium','TypeType','retail','Neutral geometric sans with a very wide range.'),
 'Cerebri Sans': ('S04','medium','Hanken','retail','Geometric sans with subtle humanist detail.'),
 'Brown': ('S04','medium','Lineto','retail','Geometric sans with a compact, technical finish.'),
 'Azo Sans': ('S04','medium','Rui Abreu','retail','Geometric sans with wide apertures.'),
 'Centrale Sans': ('S04','medium','Typedepot','retail','Geometric sans for corporate systems.'),
 'Larsseit': ('S04','medium','Type Dynamic','retail','Geometric sans with a slightly condensed cast.'),
 'Averta': ('S04','medium','Intelligent Design','retail','Geometric sans with a neutral finish.'),
 'Uni Sans': ('S04','medium','Fontfabric','retail','Geometric display sans.'),
 'Zona Pro': ('S04','medium','Fontfabric','retail','Rounded geometric display sans.'),
 'Pluto Sans': ('S04','medium','HVD','retail','Geometric sans, the upright companion to Pluto.'),
 'Glober': ('S04','medium','Fontfabric','retail','Geometric sans with rounded terminals.'),
 'Intro': ('D06','medium','Fontfabric','retail','Heavy geometric display sans in many layered styles.'),
  'Block Berthold': ('D06','medium','Berthold','retail','Heavy, irregular poster face with rough edges.'),
 'Brandon Text': ('S04','high','HVD','adobe','The text-size companion to Brandon Grotesque.'),
 'Proxima Nova Soft': ('S06','high','Mark Simonson','adobe','Rounded Proxima Nova.'),
 'League Gothic': ('S07','high','The League of Moveable Type','retail','Open revival of Alternate Gothic.'),
 'Bebas Neue': ('S07','high','Dharma Type','adobe','Condensed caps display face; also free on Google Fonts.'),
 'Calluna': ('R01','medium','exljbris','retail','Oldstyle text serif with slab-ish serifs.'),
 'FF Tisa': ('R06','medium','FontFont','adobe','Slab serif drawn for editorial text.'),
 'Freight Text': ('R03','medium','Darden Studio','adobe','The text cuts of the Freight superfamily.'),
 'Freight Display': ('R04','medium','Darden Studio','adobe','The high-contrast display cuts of Freight.'),
 'Bodoni Poster': ('R04','high','various','adobe','The ultra-heavy display Bodoni.'),
 'Fairfield': ('R03','medium','Linotype','monotype','Transitional text serif with fine serifs.'),
 'P22 Underground': ('S05','high','P22','adobe','Johnston’s London Underground alphabet.'),
 'Minion Pro': ('R01','high','Adobe','adobe','The OpenType release of Minion.'),
 'Myriad Pro': ('S02','high','Adobe','adobe','The OpenType release of Myriad.'),
 'Acumin Pro': ('S03','high','Adobe','adobe','The retail name for the Acumin system.'),
 'Copperplate': ('R08','high','Monotype','bundled','Short form of Copperplate Gothic.'),
 'Neue Helvetica': ('S01','high','Linotype','monotype','Alternate name for Helvetica Neue.'),
}

# ── promotions ──────────────────────────────────────────────────────────────
# Tier-2 names harvested from a foundry catalogue that I can in fact place. These
# were sitting unlineaged not because they are obscure but because the first pass
# only wrote out the families I reached for by name. Promoting them to tier 1 keeps
# the foundry and licensing already harvested and adds a lineage and a reason.
# name: (cluster, confidence, note)
PLACEMENTS = {
 # Hoefler & Co / Frere-Jones
 'Chronicle': ('R03','high','Scotch-derived newspaper serif across four grades.'),
 'Mercury': ('R03','high','News serif engineered for rough printing.'),
 'Mercury Text': ('R03','high','The text cuts of Mercury.'),
 'Benton Modern': ('R03','high','Benton’s news roman revived for contemporary papers.'),
 'Exchange': ('R03','high','News serif drawn for financial tables and dense text.'),
 'Poynter Oldstyle': ('R03','medium','Newspaper oldstyle from the Poynter series.'),
 'Empirica': ('R03','medium','Text serif with sharp, economical detailing.'),
 'Surveyor': ('R03','medium','Drawn from engraved map lettering; fine and high-contrast.'),
 'Obsidian': ('R04','high','Engraved didone display with sculpted shading.'),
 'Monarch': ('R04','high','High-contrast didone display serif.'),
 'Verlag': ('S04','high','Geometric sans from Guggenheim building lettering.'),
 'Retina': ('S03','high','Agate gothic drawn for stock tables at tiny sizes.'),
 'Dulcet': ('S02','medium','Humanist sans for small-size text.'),
 'Seaford': ('S02','medium','Humanist sans with an English cast.'),
 'Inkwell': ('H01','high','Hand-lettering superfamily across serif, sans and script.'),
 'Cafeteria': ('H01','medium','Casual hand lettering.'),
 'Niagara': ('S12','high','Extremely light, narrow geometric display sans.'),
 'Armada': ('S07','medium','Condensed gothic in the wood-type line.'),
 'Landmark': ('D04','medium','Inline engraved display face.'),
 'Stereo': ('D04','medium','Deco inline display.'),
 'Epitaph': ('D02','medium','Blackletter-derived display.'),
 'Nitro': ('D07','medium','Italic speed-lettering display.'),
 'Asphalt': ('D07','medium','Rough industrial display.'),
 'Grand Central': ('R08','medium','Inscriptional display drawn from terminal signage.'),
 'Dolores': ('H02','medium','Cartoon display lettering.'),
 # Sharp Type
 'Ogg Text': ('R04','high','The text cuts of Ogg.'),
 'Beatrice Headline': ('R04','medium','High-contrast display cut of Beatrice.'),
 'Beatrice Deck': ('R04','medium','Mid-size optical cut of Beatrice.'),
 'Ghost Display': ('S11','medium','Contemporary display sans with deliberate irregularity.'),
 'Ghost Text': ('S11','medium','Text companion to Ghost Display.'),
 'Residence Nouveau': ('S11','medium','Grotesk with art-nouveau-inflected detail.'),
 'Sharp Roman': ('R01','medium','Renaissance-derived roman.'),
 'Sharp Freehand': ('H03','medium','Drawn, brush-inflected display.'),
 'Alpes': ('R05','medium','Contemporary serif with soft display cuts.'),
 # Monotype classics
 'Albertina': ('R01','high','Dutch oldstyle by Chris Brand.'),
 'Blado': ('R01','high','The italic companion to Poliphilus; Aldine.'),
 'Poliphilus': ('R01','high','Aldine roman from the Hypnerotomachia.'),
 'Dante': ('R01','high','Mardersteig’s Aldine roman.'),
 'Ehrhardt': ('R01','high','Janson-derived Dutch oldstyle.'),
 'Horley Old Style': ('R01','high','English oldstyle with a large x-height.'),
 'Octavian': ('R01','high','Oldstyle with inscriptional influence.'),
 'Spectrum': ('R01','high','Van Krimpen’s book roman.'),
 'Van Dijck': ('R01','high','Dutch oldstyle after Christoffel van Dijck.'),
 'Pastonchi': ('R01','medium','Italian book roman.'),
 'Pegasus': ('R01','medium','English oldstyle with sharp serifs.'),
 'Menhart': ('R01','medium','Czech oldstyle with calligraphic stress.'),
 'Fournier': ('R03','high','Transitional after Pierre-Simon Fournier.'),
 'Photina': ('R03','high','Transitional drawn for photocomposition.'),
 'Albion': ('R03','medium','Victorian-era English transitional.'),
 'Ambroise': ('R04','high','Didot-family display in the French modern line.'),
 'Walbaum Now': ('R04','high','Current Walbaum; German modern face.'),
 'Castellar': ('R08','high','Inscribed, outlined Roman capitals.'),
 'Engravers': ('R08','high','Engraving capitals with fine serifs.'),
 'Felix Titling': ('R08','high','Inscriptional titling capitals.'),
 'Tempest Titling': ('R08','medium','Engraved titling capitals.'),
 'Solus': ('R06','medium','Gill’s slab serif.'),
 'Madera': ('S04','medium','Geometric sans for corporate systems.'),
 'Ashley Crawford': ('H03','medium','Brush-drawn display lettering.'),
 'Dubai': ('A02','medium','Arabic and Latin sans for the Dubai identity.'),
 # Grilli Type
 'GT Alpina': ('R05','high','Contemporary serif spanning text and display.'),
 'GT Canon': ('R04','medium','High-contrast display serif.'),
 'GT Ultra': ('R04','medium','Contrast display family.'),
 'GT Flaire': ('R08','medium','Flared glyphic display.'),
 'GT Pantheon': ('R08','medium','Inscriptional serif after Roman capitals.'),
 'GT Era': ('S05','medium','Geometric sans in the interwar line.'),
 'GT Haptik': ('S04','medium','Geometric sans with rounded, tactile joins.'),
 'GT Mechanik': ('S09','medium','Technical grotesk with engineered curves.'),
 'GT Standard': ('S03','medium','Grotesk with American gothic proportions.'),
 'GT Planar': ('S11','medium','Grotesk with a variable optical slant.'),
 'GT Cinetype': ('M02','medium','Drawn from film subtitle lettering.'),
 # Klim
 'Domaine': ('R04','high','High-contrast display serif; the Domaine system.'),
 'Feijoa': ('R05','high','Soft serif drawn with no straight lines.'),
 'Martina Plantijn': ('R01','high','Plantin-derived oldstyle.'),
 'Tiempos': ('R03','high','Times reworked for contemporary setting.'),
 'The Future': ('S05','medium','Geometric sans in the Futura line.'),
 'Family': ('S11','medium','Display sans with deliberately mixed reference.'),
 # Christian Schwartz
 'FF Bau': ('S01','high','Akzidenz-Grotesk revived and systematised.'),
 'FF Kievit': ('S02','high','Humanist sans with open apertures.'),
 'FF Meta Headline': ('S02','high','Display cuts of FF Meta.'),
 'Houston': ('D03','medium','Western wood-type display.'),
 'Luxury': ('R04','medium','Fashion display set spanning several registers.'),
 # Erik Spiekermann
 'FF Info': ('S02','high','Signage humanist sans.'),
 'FF Real': ('S01','high','Grotesk with a contemporary neutral finish.'),
 'Lo-Type': ('D04','medium','Berlin poster face from the deco era.'),
}
