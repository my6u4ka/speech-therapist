# Changelog

All notable changes to this project are listed here. Versions follow `vX.Y.Z` tags on `main`
(see the git flow rules in `.specify/memory/constitution.md`).

## [1.0.1] - 2026-11-08

### Fixed

- Every page now has a site icon (`assets/icon.svg`, a white speech bubble on blue). Browsers no
  longer request a missing `favicon.ico`, which used to log a 404 error in the console.

## [1.0.0] - 2026-11-08

The first public release on GitHub Pages: https://my6u4ka.github.io/speech-therapist/

### Added

- **Portal** (feature 001): the start page. Every game is a tile with a picture and a name. It has
  a home control in every game and a friendly 404 page.
- **Синоними** (feature 002, grades 2–4): mark every word close in meaning to the reference word.
  Each series has 5 rounds and the bank has 27 word sets.
- **Антоними** (feature 003, grades 2–4): connect words with opposite meanings in two columns.
  Each series has 5 rounds of 5 pairs and the bank has 57 pairs.
- **Звуци** (feature 004): gentle, synthesized sounds for tap, correct, try again, round, and
  series in every game, with an on/off control and nothing stored.
- **Какво означава?** (feature 005, grades 3–4): read a word in a sentence and choose its meaning
  from 3 explanations. Each series has 8 words and the bank has 33 entries.
