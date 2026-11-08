# Feature Specification: Game Portal

**Feature Branch**: `feature/001-game-portal`

**Created**: 2026-11-08

**Status**: Draft

**Input**: User description: "The first thing should be a portal where the child chooses which game
to be redirected to. It should contain only tiles with the game names and a large picture. There
is no grade selection: the game's theme implies the child's level, and the parent or child
chooses based on that."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Choose and open a game (Priority: P1)

The child or parent opens the site and sees all available games as tiles. Each tile has only a
large picture and the game's Bulgarian name. They pick a game by its theme and tap the tile, and
the game opens.

**Why this priority**: This is the portal's whole purpose. Without it, every game would need its
own address and an adult to open it.

**Independent Test**: Publish the portal with at least one game listed. A child taps the game's
tile and the game opens. This works without any other story.

**Acceptance Scenarios**:

1. **Given** the portal is open, **When** it finishes loading, **Then** every available game is
   shown as a tile with a large picture and its Bulgarian name, and nothing else.
2. **Given** the portal is open, **When** the child taps a game tile, **Then** that game opens in
   the same window.
3. **Given** a grade-1 child who reads slowly, **When** they look at the portal, **Then** they can
   find a game they have played before by its picture alone.
4. **Given** the portal is open, **When** it is shown, **Then** there is no grade, level, or
   profile choice before the games appear.

---

### User Story 2 - Return to the portal from any game (Priority: P2)

From inside any game, the child can always get back to the portal with one clearly visible
"home" control, and then choose another game.

**Why this priority**: It completes the navigation loop. Without it the child can still use the
browser's back button, so it is less critical than Story 1.

**Independent Test**: Open any game, tap the home control, and check that the portal appears.

**Acceptance Scenarios**:

1. **Given** the child is in any game, **When** they look at the screen, **Then** a home control is
   visible in the same place in every game.
2. **Given** the child is in a game, **When** they tap the home control, **Then** the portal opens.

---

### Edge Cases

- **A game fails to open**: the child sees a friendly message and a way back to the portal, never a
  technical error.
- **Double tap or rapid taps on a tile**: exactly one game opens.
- **A game's picture fails to load**: the tile still shows the game's name and still opens the
  game.
- **More games than fit on one screen**: the child scrolls up and down; tiles never shrink below a
  comfortable tap size, and there is no sideways scrolling.
- **Phone in portrait, tablet in landscape, desktop**: all tiles stay fully visible and large
  enough to tap.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The portal MUST be the site's start page.
- **FR-002**: The portal MUST list every available game as a tile with exactly two elements: a
  large picture and the game's short Bulgarian name.
- **FR-003**: Each game's picture MUST convey the game's theme, so the parent or child can judge
  from the tile whether the game suits the child's level, and grade-1 readers can recognize a
  game they have played before.
- **FR-004**: Tapping or clicking a game tile MUST open that game.
- **FR-005**: The portal MUST NOT ask for a grade, level, profile, or any other choice before
  showing the games.
- **FR-006**: Every game MUST provide a home control, in a consistent place, that returns to the
  portal.
- **FR-007**: Adding a new game to the portal MUST require only its name, picture, and where to
  open it, without changing how the portal works.
- **FR-008**: All portal text MUST be in Bulgarian. The portal MUST NOT show ads, purchases, or
  tracking, and MUST NOT collect or store any data about the child (constitution I and IV).
- **FR-009**: The portal MUST list only games that are part of this site. Games from other
  projects (e.g. the existing "за да, защото, заради") MUST NOT be listed or linked.

### Key Entities

- **Game entry**: one game the portal can open. Attributes: Bulgarian name, picture, and where to
  open it.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A grade-1 child who has been shown the portal once can open a chosen game without
  adult help in under 10 seconds and with a single tap.
- **SC-002**: 100% of listed games open successfully, and 100% of games return to the portal
  through the home control.
- **SC-003**: The portal loads in under 2 seconds on an ordinary mobile connection.
- **SC-004**: All tiles are fully visible and tappable without sideways scrolling, both on a
  360-pixel-wide phone screen and on a desktop screen.
- **SC-005**: Adding a new game to the portal takes the owner under 10 minutes, apart from making
  the game itself.
- **SC-006**: In a first trial with the owner's children, each child can say which game they want
  and reach it on their own on the first attempt.

## Assumptions

- The users are the owner's children (grades 1–4) on the family's phones, tablets, and computers.
  The parent may help choose a game.
- Choosing a suitable game is left to the parent and child, based on the game's theme as shown by
  its picture and name. The portal does not filter, sort, or recommend games.
- Only games that actually work are listed. There are no "coming soon" tiles; the portal is first
  released together with at least one game.
- Games open in the same browser window; the home control replaces the need for tabs.
- The portal remembers nothing between visits, because there is nothing to remember.
- Games are shown in an order the owner sets when adding them.
- The existing game "за да, защото, заради" stays a separate project with its own address.
- An internet connection is available when the site is opened. Working fully offline is out of
  scope for this feature.
