# iOS prototypes

Working prototypes of the iOS chrome — the three-layer nav stack, the glass tab
bar, the modal sheet presentation, the phone frame itself. They predate the demo
sheets and cover motion and interaction that a static specimen cannot: a sheet
that actually presents, a nav bar that actually collapses on scroll.

They are **prototypes, not reference implementations**. `demo/11-ios.html` is
the reference for what the iOS classes are; these are where the behaviour was
worked out. Where the two disagree, the demo sheet is right.

| File | Shows |
|---|---|
| `ios-nav-demo.html` | the glass tab bar, segmented control and nav bar together |
| `ios-nav-page-demo.html` | a full page inside the nav stack |
| `ios-nav-test.html` | nav states under scroll |
| `ios-modal-demo.html` | the modal sheet presentation and its stacked backdrop |
| `phone-frame-spike.html` | the phone frame itself, including the iframe variant |

Open any of them directly in a browser. Each loads `css/crnl-loader.js` and
`css/prototype-harness.js`, so the theme / mode / display-face switcher is the
same one every other page gets — the hand-pasted copy each of these used to
carry was removed (`RULES §1`).
