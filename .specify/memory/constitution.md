# Vocabulary Games Constitution

## Core Principles

### I. Child-Centered

- Every game MUST be understandable by the child without adult help after the first
  explanation.
- Feedback MUST be positive and encouraging; a wrong answer shows a hint or the correct answer,
  never a penalty, mockery, or loss of earned progress.
- Games MUST NOT have a time limit by default; a timer, if any, is explicitly enabled by the
  parent.
- The site MUST NOT contain ads, external links, purchases, or content unrelated to the game's
  purpose.

Rationale: the goal is confidence and enjoyment of words; stress and penalties work against
written expression and vocabulary growth.

### II. Correct Language Content, Separate From Code

- All game content (words, sentences, meanings, hints) MUST be in correct standard Bulgarian
  (spelling, punctuation, grammar).
- Language content MUST be stored in separate data files, not embedded in game logic, so it can
  be added and edited without changing code.
- All content MUST be reviewed and approved by the owner before publishing.
- Content SHOULD be grouped by the game's theme.

Rationale: children learn from what they see; one wrong word teaches a mistake. Separate data
lets the vocabulary grow independently of the games.

### III. Static Site on GitHub Pages

- The project MUST be a static site (HTML, CSS, JavaScript) published via GitHub Pages from the
  owner's personal repository.
- There MUST NOT be a custom server, database, user accounts, or paid services.
- The site MUST work when served directly from the published branch, with no mandatory build
  step.
- External libraries are allowed only when the plan explicitly justifies the need; plain
  JavaScript is the default.

Rationale: the same model as the existing games (e.g. "за да, защото, заради"): zero
maintenance, free hosting, easy for one person to understand and change.

### IV. Privacy by Default

- No data about the child MUST leave the device.
- Analytics, tracking cookies, and third parties that collect data MUST NOT be used.
- Progress, if stored, MUST live only in the device's browser and MUST be clearable by the
  parent.

Rationale: the users are children; the safest data is data never collected.

### V. Simplicity and Independent Games

- Every game MUST be self-contained: it can be added, changed, or removed without breaking the
  others.
- Shared code MUST be limited to what at least two games actually use.
- New functionality MUST be added only when there is a real need (YAGNI); complexity MUST be
  justified in the plan.

Rationale: the project grows game by game with the children's needs; a single developer must be
able to hold the whole system in their head.

## Constraints and Quality

- **Devices**: every game MUST be comfortably playable on tablet and phone (touch) and on
  desktop (mouse/keyboard); buttons and text MUST be large enough for a child.
- **Readability**: clear, large font with good Cyrillic support; good contrast.
- **Performance**: a game page SHOULD load in under 2 seconds on an ordinary mobile connection.
- **Target age**: children in grades 1–4 (roughly ages 6–10). There is no grade selection:
  each game's theme implies the level it suits, and the parent or child chooses a game by its
  theme. A game's spec MUST state which grades its theme is meant for. Games meant for grade 1
  MUST use short, common words and short sentences, since children are still learning to read;
  pictures SHOULD support the text where they help meaning.
- **Language**: the user interface and all game content MUST be in Bulgarian; all project
  documentation (constitution, specs, plans, tasks, README, code comments) MUST be in English.

## Development Workflow

- Every new game or change goes through Spec Kit: `/speckit-specify` → (`/speckit-clarify`) →
  `/speckit-plan` → `/speckit-tasks` → (`/speckit-analyze`) → `/speckit-implement` →
  `/speckit-converge`. The only exceptions are **small fixes**, described below.
- A **small fix** MAY skip the Spec Kit flow. A small fix is a change that adds no new behavior
  for the child and changes no requirement in any spec, for example:
  - a site icon or a missing asset;
  - a spelling or wording correction in UI text or in a word bank;
  - a CSS or layout correction;
  - a bug fix that makes the code match an existing spec;
  - documentation updates;
  - amendments to this constitution, made via `/speckit-constitution`.

  A small fix MUST:
  - be recorded in `CHANGELOG.md` when it reaches `main`;
  - keep all automated tests passing;
  - be checked in a browser where it is visible;
  - keep the affected spec, plan, or contract in line with the change, in the same branch.

  If a fix changes what a spec requires, it is not a small fix: it goes through Spec Kit.
- The owner is the sole developer and approver: each artifact (spec, plan, tasks) is approved
  by the owner before the next step.
- Branching follows **git flow**:
  - `main` is the published version (GitHub Pages serves it) and MUST contain only released,
    working, approved state. Every commit on `main` is a release tagged `vX.Y.Z`.
  - `develop` is the integration branch; all feature work starts from it and returns to it.
  - `feature/NNN-name` branches from `develop` and merges back into `develop`. `NNN-name`
    MUST match the feature's `specs/NNN-name/` folder created by `/speckit-specify`.
  - `release/X.Y.Z` branches from `develop`, takes only fixes and version/changelog updates,
    and merges into both `main` (tagged) and `develop`.
  - `hotfix/X.Y.Z` branches from `main` for urgent fixes to the published site and merges into
    both `main` (tagged) and `develop`. It holds small fixes only.
  - `fix/short-name` branches from `develop` for a small fix that is not urgent. It merges back
    into `develop` and reaches `main` with the next release. It has no `specs/` folder.
  - Merges into `develop` and `main` MUST use `--no-ff` so each feature, fix, release, and
    hotfix stays visible in history. Nothing is committed directly to `main` or `develop`.
- The feature branch MUST be created before running `/speckit-specify`, so that all Spec Kit
  artifacts for the feature are committed on that branch.
- Before a feature branch merges into `develop`, every acceptance scenario in its spec MUST be
  checked in a browser at narrow (phone) and wide (desktop) widths; before a release merges
  into `main`, all games MUST be re-checked the same way.
- Automated tests are not mandatory; if a plan introduces them, they MUST NOT require a server
  or a build step for the site.

## Governance

- This constitution supersedes all other practices in the project.
- Amendments are made only by the owner via `/speckit-constitution`, with a version bump:
  MAJOR for removing or redefining a principle; MINOR for a new principle or section; PATCH for
  clarifications and wording.
- Every `plan.md` MUST pass the Constitution Check against the principles above; any deviation
  MUST be recorded and justified in the plan's Complexity Tracking section.

**Version**: 1.2.0 | **Ratified**: 2026-11-08 | **Last Amended**: 2026-11-08
