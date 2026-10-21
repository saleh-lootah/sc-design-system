# Wave 2b brief · component families and Paper boards

Read in this order before starting:
1. `docs/v2/plan.md`
2. `docs/v2/decisions.md`. It wins over everything else, including the role-name table, which maps component-language roles onto token names.
3. `docs/v2/foundations.md`
4. `docs/v2/component-language.md`, the sections for your components
5. `docs/v2/architecture.md`, §3 encapsulation by family, and the budgets
6. `components/CONVENTIONS.md`, the build recipe
7. `docs/v2/migration.md`
8. `docs/shared-channels-ux-standard.md`, the chapters your components touch

Keep each v1 component's behaviour, accessibility and API, unless a decision or the standard changes them. The old spec and tests are in `components/specs/<tag>.md` and `components/src/components/<tag>/`, and they are the regression baseline. `sc-button` on `v2` is the reference implementation: copy its structure.

## Code agents (C1–C5)

**Setup.** Each agent works in its own worktree:

```
git -C "/Users/saleh/Developer/Claude Workspace/sc-ux-standards/design-system" worktree add -b v2-<family> "/Users/saleh/Developer/Claude Workspace/sc-v2-<family>" v2
```

Then run `npm ci` in `components/`, and `npm run build` at the repository root. Never touch the shared checkout's branch.

**Never use `git stash`** (W15): the stash is shared across every worktree. Commit work in progress on your own branch instead.

**Your tags only.** Five agents edit the same repository in parallel. Only edit the files of the tags you've been given. Shared files are append-only; don't reorder or reformat them, so merges stay clean:
- `src/global/components.css`
- `perf-budgets.json` (the `enforce` list)
- the `V1_PENDING` list in `scripts/check-literals.mjs`
- `COMPONENTS.md`
- `src/www/registry.js`
- `src/i18n/components/index.ts`
- the shared icon set

If a shared helper is missing (for example, aria forwarding on `sc-button`), add the smallest possible change and say so in your report.

**Dependencies on another family's tags.** If your component uses a tag another family is rebuilding, use it as it is on `v2` and don't edit it. Note anything that looks wrong for the coordinator. For example, the header uses `sc-button`, and `sc-search` uses `sc-button`.

**Done means:**
- Each tag follows CONVENTIONS.md: an encapsulation decision recorded in `specs/<tag>.md`, a spec written to the `sc-table.md` format, light DOM where architecture §3.1 says so, role tokens only, type roles, strings through `LocaleController`, logical properties, full RTL, Latin digits, Arabic numeric ranges written with a word, 44px targets, and motion per MOT-01 to MOT-15 with the duration rule of thumb.
- Tests: spec, e2e, `describeAxe` (EN/AR × light/dark), visual baselines, and the playground page in EN and AR.
- The tag is added to `enforce` and removed from `V1_PENDING`.
- These all pass: `npm run check`, `npm run test:e2e:v2` (one worker), `test:visual` and `check:budget`.
- Commits end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Don't push.

**Report:**
- per tag: the encapsulation used, its size against budget, and any API changes from v1 (these also go in `docs/v2/migration.md`, append-only)
- anything blocked or needing a decision
- shared files you touched

## Paper agents (P2–P5)

**File.** Paper file `01M5FAK60B6FTGZP1QCRDF9VXK` ("Shared Channels · Design System v2"). Always pass an explicit pageId. Never edit file `01M5A6FZR8XR1M22Y7T8CDWGTP` (v1) or `01M5A0E3KTNXQ1262CTCJDXCMP` (direction E). Direction E is the visual reference.

**House style.** The foundation boards already in the v2 file (pages 00–05) set the house style for section heads, specimen frames and tables: match them. The v1 component boards in file `01M5A6FZR8XR1M22Y7T8CDWGTP` (pages 06–09) are the template for board structure only:
1. Header: EN title, tag and description; Arabic title and description
2. Specimen
3. States
4. Anatomy and measurements
5. Arabic and channels
6. Usage: use and don't
7. Accessibility
8. Code: snippet, and a props, events and slots table

Don't carry over their look.

**Colour and type.**
- Use only `var(--sc-…)` tokens from the v2 file. Channel colours go through the per-channel tokens, `--sc-color-channel-<ch>-<role>`, with Dubai Now as the default specimen channel. There are no unsuffixed channel tokens in Paper.
- Type: `--sc-font-family-*`, plus size and leading tokens, with the `-ar` variants for Arabic.
- No dark-mode specimens at this stage. Instead, add a one-line note on each board giving the dark role mapping.

**Content.**
- Arabic frames use `direction: rtl`.
- LTR runs inside Arabic text are wrapped in U+2066…U+2069.
- Digits are Latin.
- Values come from `component-language.md` and `foundations.md`, read through the decisions role table. Never measure from screenshots.

**The lockup.** Where the header appears, the real Government of Dubai lockup may be placed from `/Users/saleh/Developer/Claude Workspace/sc-ux-standards/brand/government-of-dubai-lockup.svg` (decision L3: as supplied, not mirrored).

**Paper gotchas.**
- A div with only text loses its background: wrap the text in a span.
- A border shorthand followed by a side override drops the whole border: set each side.
- Write one visual group per `write_html` call.
- Use `height: fit-content`, and screenshot after each section.
- `transform: scaleX` is ignored: mirror SVG icons with a `<g transform>`.

Call `finish_working_on_nodes` at the end.

**Report:** the artboard IDs per component, anything you couldn't show, and token or spec problems you found.
