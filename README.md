# 無聊小島 v4 · Local review build

**This version is for local review. It has not been pushed to GitHub or deployed to Render.**

## 先喺自己部機試玩

1. 解壓 ZIP。
2. 雙擊 `PLAY-LOCAL.html`，用 Chrome、Edge、Firefox 或 Safari 開啟。
3. 唔使安裝、登入或連上網。畫面上方可揀日間、黃昏、夜間。
4. 接星星／禮物盒解鎖收藏，撳已收藏禮物，再按「下載故事卡 PNG」。
5. 故事卡可另外揀天色；手機可長按圖片儲存，支援系統分享嘅瀏覽器亦會顯示分享按鈕。
6. `examples` 有三張實際製成嘅 PNG，可先睇效果。

`PLAY-LOCAL.html` embeds the same game, story data and art as `public/` in one offline HTML file. Local-file storage behavior depends on the browser; an on-screen warning appears when saving is unavailable. Local progress does not automatically transfer to the Render domain.

For a stable local web origin, optionally run `python3 -m http.server 8000 --directory public` and visit `http://localhost:8000`.

## New in v4

- 圖鑑內新增「儲存已收到嘅圖鑑」：每頁 12 件，1080 × 1440 PNG，按編號排序，沿用遊戲天色。多頁逐頁下載；999 件共 84 頁。圖片不是可匯入的進度備份。
- 遊戲與故事文字停用選取／長按選單／拖曳；搜尋欄照常編輯，匯出圖片保留長按儲存，下載連結保留正常操作。右鍵不會移動小船。
- Local tests: `node tests/album-export.test.cjs` checks pagination through gift 999, empty exports, real PNG dimensions, nested pause and gesture exceptions. Native phone long-press behavior still requires device verification.

## New in v3

- Three complete scene palettes: daytime sea/clouds, dusk sunset, night stars/moon. Choice persists with existing saves. No change to movement or score when switching.
- 1080 × 1350 PNG story cards contain the gift illustration, name, collection number, theme, complete story and chosen scenery. Downloading does not remove the gift.
- 38 locally embedded SVG illustrations cover the object types; 999 theme/object gift variations remain. No image/font network requests at runtime. Twemoji art attribution is included in each image and THIRD_PARTY_NOTICES.md.
- 72 nonrepeating prompts: 24 little tasks, 24 everyday small pleasures, 24 deliberately silly questions. Category selection, shuffle and optional acknowledgment. No deadlines, streaks, penalty or forced positivity.
- Original six gift IDs, v2 collection and keyboard fixes are preserved. Opening the album/card pauses an active round; closing returns to the correct pause state.

Tone example: 「幫你張凳改個職銜。佢承擔咗咁多，至少係高級承托主任。」

## Local verification completed

- Actual game code tested using a simulated DOM/frame clock: keyboard response, simultaneous keys, A/D, touch/pointer controls, pause/resume, legacy saves, 999 unique unlocks, filtering and pagination.
- V3 checks: three scenery choices and persistence, 72 distinct prompts/nonrepeating decks, nested dialog pause/resume and ownership checks.
- Real Canvas rendering using @napi-rs/canvas: all 999 story cards rendered and measured to fit; 38 embedded SVGs loaded; three actual 1080×1350 PNG examples inspected.
- Download handler tested with a browser-API stand-in: valid PNG data, correct filename, image dimensions, story text, stale asynchronous render protection and no unowned-gift downloads.
- HTML IDs and local script references checked; standalone script contents match the modular app.

**Limit:** A headless browser download failed in this environment. These are local logic and real Canvas output tests, not a full browser UI test. Native save/share dialogs and physical keyboard latency still need testing on your device. No claim of zero latency is made.

Developer tests:
- `node tests/game.test.cjs` (Node, no extra dependencies)
- `node tests/export.test.cjs` (requires @napi-rs/canvas)
- `node tests/postcards.test.cjs` (requires @napi-rs/canvas; optionally set JOY_TEST_CJK_FONT to a local Traditional Chinese font and JOY_TEST_OUTPUT to an output folder)

## Later GitHub / Render update

Repository: https://github.com/chikeeokay/littlestarshipgame
Existing live game: https://littlestarshipgame.onrender.com

Do not upload until you are ready to publish: Render automatically deploys commits to `main`.
Upload the extracted `public/` folder and supporting files to the repository root, replacing existing files. Do not upload just the ZIP or add an extra enclosing folder.

Render settings remain: Static Site; build command `echo "Static game ready"`; publish directory `public`; no environment variables. `PLAY-LOCAL.html`, tests and examples are outside the publish directory.
