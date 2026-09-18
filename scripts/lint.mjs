#!/usr/bin/env node
/* =============================================================================
   lint.mjs — the static check RULES.md describes
   =============================================================================
   RULES.md is prose. Prose is advisory until something reads it, and the rules
   most worth enforcing are the ones that look fine while you build and fail for
   everybody else — a card on a card is invisible at rest, a hardcoded colour is
   correct in exactly one mode.

   This reads the same two sources of truth an author does:

     docs/css-api.json   what exists — the class and token surface
     RULES.md            what is allowed — cited here by section number

   and reports every place a file disagrees with them. Every finding names the
   rule it broke, so the fix is always one lookup away.

   Usage
     node scripts/lint.mjs                 # the repo's own CSS, markup, JSX and docs
     node scripts/lint.mjs path/to/page.html [more…]
     node scripts/lint.mjs --json          # machine-readable, for an agent
     node scripts/lint.mjs --strict        # warnings become errors

   Severity
     error    a rule this repository holds itself to. The build fails.
     warning  a rule with known exceptions in the shipped CSS, recorded in
              docs/roadmap.md. It does not fail the build on its own.

   The baseline
     scripts/lint-baseline.json records, per file and per rule, how many
     findings the repository already carries. The build fails on anything
     ABOVE that count and stays quiet at or below it — so existing debt does
     not block work, and no change can add to it. Shrinking a number is a
     roadmap task; raising one is a decision somebody has to write down.

       node scripts/lint.mjs --update-baseline   # after deliberately fixing
       node scripts/lint.mjs --strict            # ignore the baseline entirely

   A rule with a real exception takes an inline escape rather than a quiet
   carve-out in this file:

     <!-- crnl-lint-disable-next-line unknown-class -- why -->
     and, in CSS, the same directive inside a line comment.

   The reason after `--` is required; an escape with no reason is itself a
   finding, because an unexplained exception is the thing this file exists to
   surface.
   ============================================================================= */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, dirname, relative, extname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const API_PATH = join(ROOT, 'docs', 'css-api.json')

/* ---------------------------------------------------------------------------
   Where the rules do not apply, and why. Each entry is a decision, not a
   convenience — the reason is part of the data so it survives the next reader.
   --------------------------------------------------------------------------- */

/* The files that ARE the mechanism. RULES §2 bans :hover and :active on an
   interactive element because .surface-* and .scale-* already carry them —
   which only works because these files write them. */
const HOVER_MECHANISM = new Set([
  'interactive-tokens.css',  // the surface ladder itself
  'button-components.css',   // .btn carries its own tier internally (RULES §2)
  'boilerplate.css',         // element defaults: <a>, <summary>
  'system-ui.css',           // vendor chrome, exempt by RULES §7
  'ios-nav-components.css',  // iOS chrome reproduces Apple's own press states
  'nav-components.css',      // tabs and steps carry their indicator states
  'input-components.css',    // focus and hover on form controls
  'tag-chip-components.css', // the chip is an interactive surface
  'table-components.css',    // row hover on a scrolling table
  'list-row-components.css', // the selector and switch mechanisms
  'card-components.css',     // the tile's own press state
  'web-footer-components.css',
  'platform-tokens.css',     // review chrome, not product surface
])

/* Where a raw colour literal is the point rather than a mistake. */
const COLOUR_SOURCES = new Set([
  'design-tokens-master.css',  // defines the palette
  'themes.css',                // defines each theme's palette
  'border-effects-tokens.css', // defines the shadow tokens
  'system-ui.css',            // vendor colours, exempt by RULES §7
  'platform-tokens.css',      // the phone frame and review chrome
  'boilerplate.css',          // reset defaults
  'prototype-harness.js',
])

/* Where font-size / font-weight / line-height may be set (RULES §2). */
const TYPE_SOURCES = new Set([
  'text-styles-system.css', // the type scale itself
  'fonts.css',
  'display-fonts.css',
  'ui-fonts.css',
  'icons.css',              // the icon font's own metrics
  'design-tokens-master.css',
  'themes.css',
  'boilerplate.css',        // element defaults
  'system-ui.css',          // vendor chrome, RULES §7
  'platform-tokens.css',    // review chrome
])

/* Files whose job is to name classes in prose or scaffolding rather than to
   use them. The unknown-class rule does not read these. */
const NOT_PRODUCT_MARKUP = new Set(['sheet.css'])

/* Generated output. Linting the bundle would report every finding a second
   time under a filename nobody can fix, and it is gitignored besides. */
const GENERATED = new Set(['crnl.css', 'fonts.css', 'display-fonts.css'])

/* Markdown whose fenced html blocks are examples people copy. A guide that
   teaches a class the CSS does not have is worse than one that says nothing:
   it is wrong with authority, and it is the first thing an agent reads. The
   generated reference is excluded — it quotes the CSS rather than teaching
   from it, so a finding there would be a finding about the CSS. */
const LINTED_DOCS = [
  'docs/design-guide.md',
  'docs/theming.md',
  'README.md',
  'CLAUDE.md',
  'RULES.md',
  'demo/README.md',
]

/* Component stylesheets set their control's own type rather than composing a
   text class. That is a real inconsistency — the type scale exists so there is
   one place a size is decided — but it is the shape the system shipped in, so
   it is recorded debt rather than a build failure. See docs/roadmap.md. */
const COMPONENT_SHEETS = new Set([
  'button-components.css', 'input-components.css', 'nav-components.css',
  'ios-nav-components.css', 'tag-chip-components.css', 'table-components.css',
  'list-row-components.css', 'card-components.css', 'product-patterns.css',
  'web-footer-components.css', 'container-tokens.css', 'spacing-tokens.css',
  'border-effects-tokens.css', 'interactive-tokens.css',
])

/* The wrappers RULES §2 means by "its design system wrapper". A bare control
   inside one of these is correct — the wrapper carries the class and styles
   the control by descendant selector. */
const CONTROL_WRAPPERS = new Set([
  'input-field', 'input-control', 'input-and-message', 'input-select',
  'switch', 'stepper', 'select-box', 'ios-search', 'tabs', 'steps',
])

/* ---------------------------------------------------------------------------
   The surface: what exists at all.
   --------------------------------------------------------------------------- */

function loadSurface() {
  if (!existsSync(API_PATH)) {
    console.error(
      'lint — docs/css-api.json is missing. Run `npm run build:css-api` first:\n' +
      '       the linter checks markup against the generated surface, and\n' +
      '       cannot tell an invented class from a new one without it.'
    )
    process.exit(2)
  }
  const api = JSON.parse(readFileSync(API_PATH, 'utf8'))
  const classes = new Set()
  const tokens = new Set()
  /* Which classes paint a solid surface, read out of the CSS rather than kept
     as a list here. A hand-maintained copy would be wrong the first time a
     class stopped painting one — which is exactly the drift RULES §2 is about. */
  const paintsSurface = new Set()
  /* colour literal → the token that already holds it, so a finding can name
     the fix instead of only the problem. */
  const tokenForValue = new Map()

  for (const sheet of api.stylesheets) {
    for (const c of sheet.classes ?? []) {
      classes.add(c.name)
      if (/background(-color)?:\s*var\(--(bg|org)-(surface|sheet)\)/.test(c.declares ?? '')) {
        paintsSurface.add(c.name)
      }
    }
    for (const t of sheet.tokens ?? []) {
      tokens.add(t.name)
      const example = (t.example ?? '').trim()
      if (/^(rgba?|hsla?)\(/.test(example) || /^#[0-9a-fA-F]{3,8}$/.test(example)) {
        const key = example.replace(/\s+/g, '').toLowerCase()
        if (!tokenForValue.has(key)) tokenForValue.set(key, t.name)
      }
    }
  }
  return { classes, tokens, paintsSurface, tokenForValue }
}

/** Classes a local stylesheet defines — a page's own scaffolding is not the
    system's, but it is not invented either. */
function localClasses(cssPaths) {
  const found = new Set()
  for (const p of cssPaths) {
    if (!existsSync(p)) continue
    const src = readFileSync(p, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
    for (const m of src.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) found.add(m[1])
  }
  return found
}

/* ---------------------------------------------------------------------------
   Findings
   --------------------------------------------------------------------------- */

/** The class and token surface, loaded once at startup. */
let SURFACE = null

const findings = []

function report(severity, rule, file, line, message, rules) {
  findings.push({ severity, rule, file: relative(ROOT, file), line, message, rules })
}

/**
 * The fenced html blocks of a markdown file, with every other line blanked so
 * a reported line number still points at the real line in the real file.
 */
function htmlFromMarkdown(src) {
  const lines = src.split('\n')
  let inBlock = false
  return lines
    .map((line) => {
      if (/^\s*```html\s*$/.test(line)) { inBlock = true; return '' }
      if (inBlock && /^\s*```/.test(line)) { inBlock = false; return '' }
      return inBlock ? line : ''
    })
    .join('\n')
}

/** Line number of a character offset. */
function lineOf(src, index) {
  return src.slice(0, index).split('\n').length
}

/** Inline escapes: `crnl-lint-disable-next-line <rule> -- <reason>`. */
function readEscapes(src, file) {
  const escapes = new Map() // line number the escape covers → Set(rules)
  const re = /crnl-lint-disable-next-line\s+([\w-]+)\s*(--\s*(.*?))?(?:\*\/|-->|\n)/g
  for (const m of src.matchAll(re)) {
    const line = lineOf(src, m.index) + 1
    if (!m[3] || !m[3].trim()) {
      report('error', 'escape-without-reason', file, line - 1,
        `lint escape for \`${m[1]}\` gives no reason. Write \`-- why\` after the rule name.`,
        ['RULES §2'])
    }
    if (!escapes.has(line)) escapes.set(line, new Set())
    escapes.get(line).add(m[1])
  }
  return escapes
}

function escaped(escapes, line, rule) {
  return escapes.get(line)?.has(rule) ?? false
}

/* ---------------------------------------------------------------------------
   CSS rules
   --------------------------------------------------------------------------- */

/** Strip comments but keep offsets, so reported line numbers stay true. */
function blankComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
}

function lintCss(file, src) {
  const name = basename(file)
  const escapes = readEscapes(src, file)
  const code = blankComments(src)

  // RULES §2 — never use !important
  if (!/^(platform-tokens|text-styles-system)\.css$/.test(name)) {
    for (const m of code.matchAll(/!important/g)) {
      const line = lineOf(code, m.index)
      if (escaped(escapes, line, 'no-important')) continue
      report('error', 'no-important', file, line,
        '`!important` — the only thing it can beat is an inline style. Remove the inline style instead.',
        ['RULES §2'])
    }
  } else {
    const count = [...code.matchAll(/!important/g)].length
    if (count) {
      report('warning', 'no-important', file, 1,
        `${count} \`!important\` declaration(s) — recorded debt, resolved by moving this file into a cascade layer. See docs/roadmap.md.`,
        ['RULES §2'])
    }
  }

  // RULES §2 — never hardcode a colour
  if (!COLOUR_SOURCES.has(name)) {
    const colour = /(#[0-9a-fA-F]{3,8}\b|\brgba?\([^)]*\)|\bhsla?\([^)]*\))/g
    for (const m of code.matchAll(colour)) {
      const line = lineOf(code, m.index)
      // A literal inside var(--token, …) is an allowed fallback (RULES §2).
      const before = code.lastIndexOf('var(', m.index)
      const lineStart = code.lastIndexOf('\n', m.index)
      if (before > lineStart && code.slice(before, m.index).includes(',')) continue

      /* A shadow is the one place the system has no colour token to reach for:
         the scales are surfaces and text, and a shadow needs its own alpha.
         Real debt — a --shadow-colour scale would close it — but not a failure
         a new contributor caused. */
      const decl = code.slice(lineStart + 1, m.index)
      const inShadow = /(box-shadow|text-shadow|drop-shadow|filter)\s*:/.test(decl) ||
        /(box-shadow|text-shadow)\s*:[^;]*$/.test(
          code.slice(Math.max(0, m.index - 400), m.index))
      const rule = inShadow ? 'no-hardcoded-shadow-colour' : 'no-hardcoded-colour'
      if (escaped(escapes, line, rule) || escaped(escapes, line, 'no-hardcoded-colour')) continue

      const key = m[0].replace(/\s+/g, '').toLowerCase()
      const named = SURFACE.tokenForValue.get(key)
      if (inShadow) {
        report('warning', rule, file, line,
          `hardcoded colour \`${m[0]}\` in a shadow — the system has no shadow-colour scale yet. See docs/roadmap.md.`,
          ['RULES §2'])
      } else {
        report('error', rule, file, line,
          named
            ? `hardcoded colour \`${m[0]}\` — that exact value is \`var(${named})\`.`
            : `hardcoded colour \`${m[0]}\` — use a semantic token. A literal is correct in exactly one mode.`,
          ['RULES §2'])
      }
    }
  }

  // RULES §2 — never set font-size, font-weight or line-height
  if (!TYPE_SOURCES.has(name)) {
    for (const m of code.matchAll(/\b(font-size|font-weight|line-height)\s*:/g)) {
      const line = lineOf(code, m.index)
      if (escaped(escapes, line, 'no-type-override')) continue
      report(COMPONENT_SHEETS.has(name) ? 'warning' : 'error', 'no-type-override', file, line,
        COMPONENT_SHEETS.has(name)
          ? `\`${m[1]}\` set in a component stylesheet rather than composed from a text class — recorded debt, see docs/roadmap.md.`
          : `\`${m[1]}\` set outside the type scale — use a text class, or add a step to text-styles-system.css.`,
        ['RULES §2', 'RULES §5'])
    }
  }

  // RULES §2 — never force letter case
  for (const m of code.matchAll(/\btext-transform\s*:\s*(uppercase|lowercase|capitalize)/g)) {
    const line = lineOf(code, m.index)
    if (escaped(escapes, line, 'no-text-transform')) continue
    report('error', 'no-text-transform', file, line,
      `\`text-transform: ${m[1]}\` — case belongs to the copy and to the theme's display face, which bakes it in.`,
      ['RULES §2', 'RULES §5'])
  }

  // RULES §2 — never write :hover or :active on an interactive element
  if (!HOVER_MECHANISM.has(name)) {
    for (const m of code.matchAll(/:(hover|active)\b/g)) {
      const line = lineOf(code, m.index)
      if (escaped(escapes, line, 'no-hover-rule')) continue
      report('error', 'no-hover-rule', file, line,
        `\`:${m[1]}\` — .surface-* and .scale-* are the hover and press mechanism. Pair one of each on the element instead.`,
        ['RULES §2', 'RULES §3'])
    }
  }

  // RULES §2 — never hardcode spacing
  if (!COLOUR_SOURCES.has(name) && name !== 'spacing-tokens.css' && name !== 'container-tokens.css') {
    const spacing = /\b(margin|padding|gap|row-gap|column-gap)(-(top|right|bottom|left|inline|block))?\s*:\s*([^;{}]+)/g
    for (const m of code.matchAll(spacing)) {
      const value = m[4]
      if (!/\d\s*(px|rem|em)\b/.test(value)) continue
      if (/^\s*0(px|rem|em)?\s*$/.test(value)) continue
      const line = lineOf(code, m.index)
      if (escaped(escapes, line, 'no-hardcoded-spacing')) continue
      report('warning', 'no-hardcoded-spacing', file, line,
        `\`${m[1]}: ${value.trim()}\` — use a spacing token or utility.`,
        ['RULES §2'])
    }
  }

  // RULES §2 — --brand-interactive / --brand-inverted are theme-scoped only
  if (name !== 'themes.css' && name !== 'design-tokens-master.css') {
    for (const m of code.matchAll(/var\(\s*(--brand-(?:interactive|inverted))\s*[),]/g)) {
      const line = lineOf(code, m.index)
      if (escaped(escapes, line, 'no-theme-scoped-token')) continue
      report('error', 'no-theme-scoped-token', file, line,
        `\`${m[1]}\` in a component — one value per theme, so it renders dark-on-dark in one mode. Use --color-interactive / --color-inverted.`,
        ['RULES §2'])
    }
  }
}

/* ---------------------------------------------------------------------------
   Markup rules — HTML and JSX
   --------------------------------------------------------------------------- */

/** Surfaces whose tappable form wants a matching .scale-* (RULES §3 #14). */
const TAPPABLE_NEEDS_SCALE = /^surface-(fill|border|wash|ghost|card)/

function classAttrs(src, jsx) {
  const re = jsx
    ? /class(?:Name)?\s*=\s*(?:"([^"]*)"|'([^']*)'|\{`([^`]*)`\})/g
    : /class\s*=\s*(?:"([^"]*)"|'([^']*)')/g
  const out = []
  for (const m of src.matchAll(re)) {
    const raw = m[1] ?? m[2] ?? m[3] ?? ''
    out.push({ index: m.index, raw })
  }
  return out
}

function lintMarkup(file, src, surface, extra) {
  const jsx = /\.[jt]sx$/.test(file)
  const escapes = readEscapes(src, file)
  const known = new Set([...surface.classes, ...extra])

  for (const { index, raw } of classAttrs(src, jsx)) {
    const line = lineOf(src, index)
    // Skip interpolated values — a template expression is not a literal list.
    if (raw.includes('${') || (jsx && raw.includes('{'))) continue
    const names = raw.split(/\s+/).filter(Boolean)

    // RULES §2 / the CSS surface — if it is not in css-api.md it does not exist
    if (!escaped(escapes, line, 'unknown-class')) {
      for (const n of names) {
        if (known.has(n)) continue
        if (/^(data-|aria-)/.test(n)) continue
        report('error', 'unknown-class', file, line,
          `\`.${n}\` is not in docs/css-api.json. Either it does not exist, or it is page scaffolding that its own stylesheet must declare.`,
          ['RULES §2', 'RULES §3'])
      }
    }

    // RULES §2 — .btn and .btn-circle carry their scale tier internally
    if ((names.includes('btn') || names.includes('btn-circle')) &&
        names.some((n) => n.startsWith('scale-')) &&
        !escaped(escapes, line, 'btn-no-scale')) {
      report('error', 'btn-no-scale', file, line,
        'a `.scale-*` on a `.btn` — the button already carries its tier internally.',
        ['RULES §2'])
    }

    // RULES §3 #14 — anything tappable pairs a surface with a scale
    const surfaceClass = names.find((n) => TAPPABLE_NEEDS_SCALE.test(n))
    const hasScale = names.some((n) => /^scale-(300|500|700)$/.test(n))
    const isRowOrSection = names.includes('list-row') || names.includes('surface-section')
    /* A disabled control does not respond to press, so it takes no scale. */
    const isDisabled = names.includes('is-disabled') || names.includes('disabled')
    if (surfaceClass && !hasScale && !isRowOrSection && !isDisabled &&
        !names.includes('btn') && !names.includes('btn-circle') &&
        !escaped(escapes, line, 'surface-needs-scale')) {
      report('warning', 'surface-needs-scale', file, line,
        `\`.${surfaceClass}\` with no \`.scale-*\`. Two things take a surface and no scale: a row on its own, and one band of a divided card (.surface-section).`,
        ['RULES §3'])
    }

    /* RULES §3 #14 — a tappable surface has to be on something a keyboard can
       reach. The surface + scale pair is the system's statement that this
       element is a target; on a <div> it is a target nobody can tab to, and
       it fails silently — the page looks right in every screenshot.

       Native interactive elements carry it for free. Anything else has to say
       so with a role and a tabindex, which is also what makes a screen reader
       announce it as actionable. A demo specimen that is showing the surface
       rather than shipping a control takes the escape. */
    const tappable = surfaceClass && hasScale
    if (tappable && !escaped(escapes, line, 'unreachable-target')) {
      const tag = tagAt(src, index)
      const native = /^(button|a|input|select|textarea|summary|label)$/i.test(tag)
      const hasRole = /\brole\s*=/.test(attrsAt(src, index))
      const focusable = /\btabindex\s*=\s*["']?-?\d/.test(attrsAt(src, index))
      if (!native && !(hasRole && focusable)) {
        report('warning', 'unreachable-target', file, line,
          `<${tag}> carries \`.${surfaceClass}\` + a \`.scale-*\` — the system's way of saying "this is a target" — but a keyboard cannot reach it. Use a <button> or an <a>, or add both a role and tabindex="0". See docs/roadmap.md § gap 0.`,
          ['RULES §3'])
      }
    }

    // RULES §4 — canonical icon form
    if (names.includes('icon') && names.includes('material-symbols-rounded') &&
        !escaped(escapes, line, 'icon-form')) {
      report('error', 'icon-form', file, line,
        '`.icon` already sets the font family — never add `material-symbols-rounded` next to it.',
        ['RULES §4'])
    }
  }

  // RULES §2 — no hardcoded colour, type or spacing in an inline style
  const styleAttr = jsx
    ? /style\s*=\s*\{\{([^}]*)\}\}/g
    : /style\s*=\s*"([^"]*)"/g
  for (const m of src.matchAll(styleAttr)) {
    const line = lineOf(src, m.index)
    const value = m[1]
    if (/(#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\()/.test(value) &&
        !escaped(escapes, line, 'no-hardcoded-colour')) {
      report('error', 'no-hardcoded-colour', file, line,
        'hardcoded colour in an inline style — use a semantic token.', ['RULES §2'])
    }
    if (/\b(fontSize|font-size|fontWeight|font-weight|lineHeight|line-height)\b/.test(value) &&
        !escaped(escapes, line, 'no-type-override')) {
      report('error', 'no-type-override', file, line,
        'type set in an inline style — use a text class.', ['RULES §2', 'RULES §5'])
    }
  }

  /* RULES §2 — never use a bare <button>, <select> or <input> *without its
     design system wrapper*. The wrapper is the other half of the rule: inside
     .input-control the bare element is the correct form, because the wrapper
     carries the class and styles the control by descendant selector. */
  for (const m of src.matchAll(/<(button|select|input)\b([^>]*)>/g)) {
    const line = lineOf(src, m.index)
    const attrs = m[2]
    if (escaped(escapes, line, 'bare-control')) continue
    if (/class(?:Name)?\s*=/.test(attrs)) continue
    if (m[1] === 'input' && /type\s*=\s*["']?(checkbox|radio|hidden|file)/.test(attrs)) continue
    const ancestry = openClassesAt(src, m.index)
    if (ancestry.some((n) => CONTROL_WRAPPERS.has(n))) continue
    report('error', 'bare-control', file, line,
      `a bare <${m[1]}> with no design system class and no wrapper. Demos and utility controls are not exempt.`,
      ['RULES §2'])
  }

  // RULES §1 — never hand-write a <link> for the CSS or a font
  for (const m of src.matchAll(/<link\b[^>]*rel\s*=\s*["']?stylesheet[^>]*>/g)) {
    const line = lineOf(src, m.index)
    if (escaped(escapes, line, 'no-css-link')) continue
    const href = /href\s*=\s*["']([^"']*)["']/.exec(m[0])?.[1] ?? ''
    if (/(^|\/)css\//.test(href) || /fonts\.googleapis|fonts\.gstatic/.test(href)) {
      report('error', 'no-css-link', file, line,
        `hand-written stylesheet link \`${href}\` — crnl-loader.js owns the order, and a hand-written list has been wrong every time.`,
        ['RULES §1'])
    }
  }

  // RULES §2 — never sit a solid surface on another solid surface.
  // Static approximation: two surface-painting classes nested in the same
  // element chain. The harness catches at runtime what this cannot see.
  lintSurfaceNesting(file, src, escapes)
}

const VOID_TAGS = /^(img|br|hr|input|meta|link|source|area|base|col|embed|param|track|wbr)$/i

/** Walk the tag stream and return the element stack at a character offset. */
function tagWalk(src, onOpen) {
  const tagRe = /<(\/?)([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^>"'])*?)(\/?)>/g
  const stack = []
  for (const m of src.matchAll(tagRe)) {
    const [, closing, tag, attrs, selfClose] = m
    if (closing) {
      const at = stack.map((f) => f.tag).lastIndexOf(tag)
      if (at >= 0) stack.length = at
      continue
    }
    const cls = /class(?:Name)?\s*=\s*["']([^"']*)["']/.exec(attrs)?.[1] ?? ''
    const names = cls.split(/\s+/).filter(Boolean)
    onOpen?.(m, names, stack)
    if (!selfClose && !VOID_TAGS.test(tag)) stack.push({ tag, names })
  }
}

/** The tag name of the element whose attributes contain this offset. */
function tagAt(src, index) {
  const open = src.lastIndexOf('<', index)
  return /^<\s*([a-zA-Z][\w-]*)/.exec(src.slice(open, index + 1))?.[1] ?? 'div'
}

/** The raw attribute text of the element whose attributes contain this offset. */
function attrsAt(src, index) {
  const open = src.lastIndexOf('<', index)
  const close = src.indexOf('>', index)
  return close > open ? src.slice(open, close) : ''
}

/** Every class on every open ancestor at an offset. */
function openClassesAt(src, index) {
  let found = []
  tagWalk(src, (m, names, stack) => {
    if (m.index === index) found = stack.flatMap((f) => f.names)
  })
  return found
}

/** Flag a surface-painting element inside another (RULES §2). */
function lintSurfaceNesting(file, src, escapes) {
  tagWalk(src, (m, names, stack) => {
    const paints = names.find((n) => SURFACE.paintsSurface.has(n))
    if (!paints) return
    const outerFrame = stack.find((f) => f.names.some((n) => SURFACE.paintsSurface.has(n)))
    if (!outerFrame) return
    const outer = outerFrame.names.find((n) => SURFACE.paintsSurface.has(n))
    const line = lineOf(src, m.index)
    if (escaped(escapes, line, 'surface-on-surface')) return
    report('error', 'surface-on-surface', file, line,
      `\`.${paints}\` inside \`.${outer}\` — both paint a solid surface, so the inner one is invisible at rest and only appears on hover. Use a .surface-wash*, or step up to --bg-sheet.`,
      ['RULES §2'])
  })
}

/* ---------------------------------------------------------------------------
   Walking
   --------------------------------------------------------------------------- */

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'tests', 'fonts', 'built-fonts', '_build'])

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue
    const p = join(dir, entry)
    if (statSync(p).isDirectory()) walk(p, out)
    else out.push(p)
  }
  return out
}

function defaultTargets() {
  return [
    ...walk(join(ROOT, 'css')),
    ...walk(join(ROOT, 'demo')),
    ...walk(join(ROOT, 'src')),
    ...LINTED_DOCS.map((d) => join(ROOT, d)).filter((p) => existsSync(p)),
  ]
}

/* ---------------------------------------------------------------------------
   Run
   --------------------------------------------------------------------------- */

const argv = process.argv.slice(2)
const asJson = argv.includes('--json')
const strict = argv.includes('--strict')
const updateBaseline = argv.includes('--update-baseline')
const paths = argv.filter((a) => !a.startsWith('--'))

SURFACE = loadSurface()
const surface = SURFACE
const targets = (paths.length ? paths.map((p) => join(ROOT, p)) : defaultTargets())
  .filter((p) => /\.(css|html|jsx|tsx|md)$/.test(p))
  .filter((p) => !GENERATED.has(basename(p)))

/* A page's own stylesheet declares its scaffolding. Anything it defines is
   known to the markup beside it — not system surface, but not invented. */
const scaffolding = localClasses([
  ...targets.filter((p) => extname(p) === '.css' && NOT_PRODUCT_MARKUP.has(basename(p))),
  join(ROOT, 'demo', 'sheet.css'),
])

for (const file of targets) {
  const src = readFileSync(file, 'utf8')
  if (extname(file) === '.css') {
    if (NOT_PRODUCT_MARKUP.has(basename(file))) continue
    lintCss(file, src)
  } else if (extname(file) === '.md') {
    /* Only the html examples, and only the rules that read markup. The prose
       around them is prose. */
    lintMarkup(file, htmlFromMarkdown(src), surface, scaffolding)
  } else {
    lintMarkup(file, src, surface, scaffolding)
  }
}

/* ---------------------------------------------------------------------------
   The baseline: what this repository already carries.
   --------------------------------------------------------------------------- */

const BASELINE_PATH = join(ROOT, 'scripts', 'lint-baseline.json')

function countByKey(list) {
  const counts = {}
  for (const f of list) {
    const key = `${f.file} ${f.rule}`
    counts[key] = (counts[key] ?? 0) + 1
  }
  return counts
}

const counts = countByKey(findings)

if (updateBaseline) {
  const sorted = Object.fromEntries(Object.entries(counts).sort())
  const body = {
    _generated: 'node scripts/lint.mjs --update-baseline',
    _what: 'Findings this repository already carries, per file and per rule. ' +
           'The build fails above these counts and is quiet at or below them. ' +
           'A number going down is progress; a number going up needs a reason.',
    _total: findings.length,
    counts: sorted,
  }
  const { writeFileSync } = await import('node:fs')
  writeFileSync(BASELINE_PATH, JSON.stringify(body, null, 2) + '\n')
  console.log(`lint — baseline written: ${findings.length} finding(s) across ${Object.keys(sorted).length} file/rule pair(s).`)
  process.exit(0)
}

const baseline = existsSync(BASELINE_PATH)
  ? JSON.parse(readFileSync(BASELINE_PATH, 'utf8')).counts ?? {}
  : {}

/* A finding is "new" when its file/rule pair exceeds the recorded count.
   Which specific line is over the line is not knowable from a count, so the
   whole pair is reported and the excess is what fails the build. */
const overBaseline = []
for (const [key, n] of Object.entries(counts)) {
  const allowed = baseline[key] ?? 0
  if (n > allowed) overBaseline.push({ key, n, allowed, excess: n - allowed })
}
const belowBaseline = []
for (const [key, allowed] of Object.entries(baseline)) {
  const n = counts[key] ?? 0
  if (n < allowed) belowBaseline.push({ key, n, allowed })
}

const scoped = paths.length > 0
const baselineApplies = !strict && !scoped

const errors = findings.filter((f) => f.severity === 'error')
const warnings = findings.filter((f) => f.severity === 'warning')

if (asJson) {
  console.log(JSON.stringify({
    files: targets.length,
    errors: errors.length,
    warnings: warnings.length,
    overBaseline,
    belowBaseline,
    findings,
  }, null, 2))
} else {
  console.log(`lint — ${targets.length} file(s) against docs/css-api.json and RULES.md\n`)
  const byFile = new Map()
  for (const f of findings) {
    if (!byFile.has(f.file)) byFile.set(f.file, [])
    byFile.get(f.file).push(f)
  }
  for (const [file, list] of [...byFile].sort()) {
    console.log(`  ${file}`)
    for (const f of list.sort((a, b) => a.line - b.line)) {
      const tag = f.severity === 'error' ? 'error  ' : 'warning'
      console.log(`    ${tag} ${f.line}:${' '.repeat(Math.max(0, 5 - String(f.line).length))} ${f.message}`)
      console.log(`             ${f.rule} · ${f.rules.join(', ')}`)
    }
    console.log('')
  }
  if (!findings.length) {
    console.log('  Clean.\n')
  } else {
    console.log(`  ${errors.length} error(s), ${warnings.length} warning(s).`)
    if (baselineApplies) {
      console.log(`  ${findings.length - overBaseline.reduce((a, o) => a + o.excess, 0)} at or below the recorded baseline.`)
    }
    console.log('')
  }

  if (belowBaseline.length && baselineApplies) {
    console.log('  Below the baseline — run `node scripts/lint.mjs --update-baseline` to lock the gain in:')
    for (const b of belowBaseline) console.log(`    ${b.key}  ${b.allowed} → ${b.n}`)
    console.log('')
  }

  if (overBaseline.length && baselineApplies) {
    console.log('  Above the recorded baseline:')
    for (const o of overBaseline) {
      console.log(`    ${o.key}  ${o.allowed} recorded, ${o.n} found`)
    }
    console.log('')
  }
}

/* Scoped runs (an explicit path) and --strict do not consult the baseline:
   the first is somebody checking one file, the second is the true debt. */
if (strict || scoped) process.exit(errors.length || (strict && warnings.length) ? 1 : 0)
process.exit(overBaseline.length ? 1 : 0)
