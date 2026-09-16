### Page width and page padding

Containers own both the max-width and the responsive horizontal padding, so you never write
`max-width: 1200px; margin: 0 auto; padding: 0 32px` by hand.

Breakpoints are the system's three (RULES §9).

### Pitfalls

**Don't pad at two levels.** If a full-bleed wrapper has horizontal padding and the inner
container has it too, the content is double-padded. Let one level own it: the outer element
handles background and borders, the inner `.container*` handles horizontal padding.

**Page width is always a container class**, never a hand-rolled `max-width`. See RULES §4
and §9.
