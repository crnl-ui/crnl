# Third-party marks in this directory

Most of this repository is MIT-licensed. **The brand marks in this directory are
not**, and the project has no authority to license them. They belong to their
respective owners and are included here under nominative use — a payment row
showing which cards are accepted, an app page showing where the app is
downloaded. That is the purpose each owner publishes these marks for.

Including them here is not a claim of ownership, a grant of rights, or a
suggestion that any of these companies endorses, sponsors or is affiliated with
this project. None of them do.

## What belongs to whom

| File | Mark | Owner |
|---|---|---|
| `pay-visa.svg` | Visa | Visa Inc. |
| `pay-mastercard.svg` | Mastercard | Mastercard International Incorporated |
| `pay-amex.svg` | American Express | American Express Company |
| `pay-discover.svg` | Discover | Discover Financial Services |
| `pay-applepay.svg` | Apple Pay | Apple Inc. |
| `pay-googlepay.svg` | Google Pay | Google LLC |
| `wallet-apple.svg` | Add to Apple Wallet | Apple Inc. |
| `wallet-google.svg` | Google Wallet | Google LLC |
| `badge-app-store.svg` | Download on the App Store | Apple Inc. |
| `badge-google-play.svg` | Get it on Google Play | Google LLC |

Apple, the Apple logo, Apple Pay, Apple Wallet and App Store are trademarks of
Apple Inc. Google, Google Pay, Google Wallet and Google Play are trademarks of
Google LLC. Visa is a trademark of Visa Inc. Mastercard is a trademark of
Mastercard International Incorporated. American Express is a trademark of
American Express Company. Discover is a trademark of Discover Financial
Services.

## What in this directory *is* MIT

`pay-generic.svg`, `placeholder-logo.svg` and `placeholder-media-1.svg` through
`placeholder-media-3.svg` are original to this project and carry the repository
licence. `pay-generic.svg` is the neutral card mark — use it wherever a real
network mark is not warranted.

## If you redistribute or ship these

Complying with each owner's brand guidelines is your responsibility, not this
project's. The constraints are real: most specify minimum sizes, clear space,
permitted colour variants, and forbid altering the artwork or implying
endorsement.

The store badges are the strictest. Apple and Google both intend their badge to
be downloaded from their own site rather than copied from a third party, and
both forbid modification. The copies here are for prototyping. If you ship to
production, fetch the current artwork from the source:

- Apple — App Store badge: <https://developer.apple.com/app-store/marketing/guidelines/>
- Apple — Apple Pay: <https://developer.apple.com/apple-pay/marketing/>
- Apple — Wallet: <https://developer.apple.com/design/human-interface-guidelines/wallet>
- Google — Play badge: <https://play.google.com/intl/en_us/badges/>
- Google — Pay: <https://developers.google.com/pay/api/web/guides/brand-guidelines>
- Google — Wallet: <https://developers.google.com/wallet>

The card networks publish theirs through their brand or merchant centres —
Visa, Mastercard, American Express and Discover each maintain one. Links move;
the owner is always authoritative over anything written here.

## Removing them

No stylesheet depends on these files. Every one of them is reached through the
asset map at the top of `demo/demo-content.js`, by asset id — the demo sheets
never name a path (`RULES §6`). The components that display them (`.wallet-btn`,
the payment-mark rows) style the chrome only; the image comes from the content
layer.

So removing them is a single edit: point those entries at `pay-generic.svg` or
your own assets and delete the files. Nothing else needs to change.
