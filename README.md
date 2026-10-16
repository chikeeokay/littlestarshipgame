# 無聊小島 · Little Joy Harbour v2

A Cantonese one-minute game: catch stars and gift boxes with a cat in a paper boat.

## Version 2

- Exactly 999 gift entries with unique names and stories, built from 27 themes and 37 object variations. Theme colors and badges distinguish variations; emoji icons are shared, not 999 custom drawings.
- Original six gift IDs and localStorage key are preserved for existing players on the same domain.
- Five stars unlock one gift. Every seventh falling item is a gift box; catching it unlocks an extra gift. No duplicates until all 999 have been discovered.
- Searchable album with theme filter, owned-only filter, pagination and story details. Only 18 cards render per album page, and six recent gifts appear in the sidebar.
- Immediate keyboard press response, independent held-key tracking, continuous frame-based motion at 1.35 playfield widths/second instead of 0.65. Releasing one key no longer cancels another held key. Arrow keys and A/D work.
- Keyboard and pointer input clear on pause/blur/restart. Opening the album pauses an active round and closing it resumes that round.

## Try locally first

Extract the ZIP, then open `public/index.html` in Chrome, Edge, Firefox or Safari. Keep `game.js` and `gifts.js` alongside the HTML. No installation or build needed.

For a consistent browser origin and save behavior, optionally run `python3 -m http.server 8000 --directory public` from this folder and open `http://localhost:8000`.

Manual checks:
1. Start a round. Tap and hold left/right or A/D. Test switching direction while still holding the other key.
2. Release both keys: the boat should stop. Hold a direction to reach the edge without moving outside it.
3. Catch five stars and a gift box; inspect new gifts in the sidebar and album.
4. Search for 鯨魚, select 太空, and toggle owned-only. Close the album and check the round resumes.
5. Pause or switch tabs and return; press continue. Test touch dragging and on-screen direction buttons on a phone.

## Automated local checks

Requires Node.js; no npm dependencies. Run `node tests/game.test.cjs`.

This tests the actual shipped game scripts with simulated DOM/canvas and frame timing. It verifies 999 unique entries, legacy saves, all 999 unlocks without duplicates, reload persistence, direct gift catches, keyboard event response, simultaneous keys, pointer controls, pause/resume, search, filtering, pagination, restart and storage failure.

These tests passed. A real browser was unavailable in the test environment, so visual layout and physical end-to-end input latency have not been measured. No claim of zero device latency is made.

## Update the existing GitHub / Render site

Repository: https://github.com/chikeeokay/littlestarshipgame
Live URL: https://littlestarshipgame.onrender.com

After local review, upload the extracted contents to the repository root using **Add file → Upload files**. Replace `public/index.html`, and add `public/game.js` and `public/gifts.js`. Upload the whole `public` folder to preserve this layout. Do not upload only the ZIP and do not add an enclosing folder. Commit to `main`.

Render is already configured to automatically deploy changes to `main`, so committing the update publishes it. Build command: `echo "Static game ready"`. Publish directory: `public`. No environment variables.

Expected files:
- public/index.html
- public/game.js
- public/gifts.js
- tests/game.test.cjs
- render.yaml
- README.md

Existing progress on the same Render domain remains. Progress does not transfer automatically between the local preview, ChatGPT Site and Render domain. Clearing browser data removes progress.
