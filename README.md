# 無聊小島 v9 · 耳仔去旅行

解壓後雙擊 PLAY-LOCAL.html，展開「聲音、天色及落星速度」。

新增兩款本機合成背景旋律：Lo-fi「放工未遂」、柔和鋼琴「今日算啦」。音樂預設關閉，選好再播放；有獨立音樂音量及總音量。
八款可混搭合成自然聲景：雨、海浪、微風、山間溪流、遠處瀑布、森林雀鳥、夏夜蟲鳴、池塘蛙聲。保留接星音效和頌缽。全部離線可用，不是實地錄音或真鋼琴採樣。
選擇會記住，切到背景頁面會靜音，回來點一下繼續。

本地 Web Audio 模擬測試及遊戲回歸測試通過。未做實際瀏覽器聽感、手機測試。
GitHub 更新：將 public 資料夾全部內容覆蓋原 public（包括 audio.js 和 index.html）。不要直接上傳 ZIP。此更新尚未推送 GitHub 或 Render。

---

# 無聊小島 v8 · 不限時自由漂流

版面：遊戲優先，電腦右側並列支線與收藏，設定預設收合、按一下可展開；手機先顯示遊戲再顯示支線與收藏。保留大字，按螢幕高度調整遊戲區，細螢幕仍容許正常捲動。

預設不限時，隨時暫停／繼續，按「結束今局」結算。收藏保留。解壓後開 PLAY-LOCAL.html 試玩；更新 GitHub 時覆蓋 public 資料夾全部內容。未更新線上版。

# 無聊小島 v7 · 大字、左右瀏覽與三檔速度

先解壓，開 PLAY-LOCAL.html 本地試玩。更新 GitHub 時覆蓋 public 全部檔案，勿上傳 ZIP 本身。Render 會依原有設定從 main 自動部署。

- 主要介面、按鈕、禮物名稱與故事卡文字加大。
- 禮物故事卡有上一件／下一件按鈕，亦支援鍵盤左右鍵；只瀏覽已收藏，首尾循環。
- 寬螢幕：現實支線位於主標題右邊；天色選擇位於音效列右邊。較窄螢幕自動換行。
- 今日想睇改為勾選，可同時選多類，預設全部；全部取消會回到全部。
- 頌缽為點擊一次、約七秒衰減的本機合成音效，遵從總音量與靜音，並限制快速連擊。
- 落星速度：慢慢嚟 0.65 倍、啱啱好 1 倍、快少少 1.5 倍，可即時切換並記住選擇；生成頻率不變。

驗證：遊戲及圖片既有測試、新增速度／禮物切換／分類測試，以及模擬 Web Audio 頌缽測試通過。使用繁中字型實際繪製 999 張故事卡，故事未超出版面；examples 有新版圖片。此環境缺少瀏覽器執行檔，未完成真實瀏覽器版面、手機操作與聽感測試。GitHub／Render 尚未更新。

---

# 無聊小島 v6 · 聲音與精簡版面

解壓後開 PLAY-LOCAL.html 本地試玩。要更新 GitHub，將 public 內所有檔案覆蓋原 public，記得包括新增 audio.js。提交 main 會觸發原 Render 自動部署。

- 基本接星音效預設開啟，第一次點擊／按鍵後啟動聲音。
- 雨聲、海浪、微風可勾選混播；音量與全體靜音可調，偏好會儲存在此瀏覽器。
- 自然音為本機合成的環境聲，並非實地錄音；不需要下載素材。切到背景頁時靜音。
- PC 的「今日想睇」移至遊戲右上方；收緊標題、留白與收藏卡。手機仍是直排。
- 保留 999 收藏、三種背景、高清圖片及 v5 句庫。

測試：既有遊戲／圖片測試通過，另以 Web Audio 模擬測試驗證多選、音量、靜音與儲存。未完成真實瀏覽器版面、手機操作及揚聲器聽感測試。未更新 GitHub 或 Render。

---

# 無聊小島 v5 · Local review build

**This version is for local review. It has not been pushed to GitHub or deployed to Render.**

## 先喺自己部機試玩

1. 解壓 ZIP。
2. 雙擊 `PLAY-LOCAL.html`，用 Chrome、Edge、Firefox 或 Safari 開啟。
3. 唔使安裝、登入或連上網。畫面上方可揀日間、黃昏、夜間。
4. 接星星／禮物盒解鎖收藏，撳已收藏禮物，再按「下載故事卡圖片」。
5. 故事卡可另外揀天色；手機可長按圖片儲存，支援系統分享嘅瀏覽器亦會顯示分享按鈕。
6. `examples` 有三張實際製成嘅 PNG，可先睇效果。

`PLAY-LOCAL.html` embeds the same game, story data and art as `public/` in one offline HTML file. Local-file storage behavior depends on the browser; an on-screen warning appears when saving is unavailable. Local progress does not automatically transfer to the Render domain.

For a stable local web origin, optionally run `python3 -m http.server 8000 --directory public` and visit `http://localhost:8000`.

## New in v5

- 打開圖鑑即顯示已收藏，清除舊搜尋／主題條件，回到第一頁；收藏格移到儲存按鈕前面。未收藏會有明確提示。
- 下載按鈕改用「圖片」。故事卡 2160 × 2700、圖鑑 2160 × 2880，仍為無損 PNG 檔案。
- 保留原有 72 條，加上 60 物件 × 20 句式 × 3 角度 × 3 類別，共 10,872 款支線組合。這是模板組合庫，並非一萬篇獨立手寫故事。瀏覽記錄儲存在本機，同類未看完前不重複。
- 卡片留白加入支線文字，可按「換句隨卡廢話」。每次開卡換新句；切換天色保留同一句。
- 頁尾有 25 段短句 × 40 個小標語，共 1,000 款配搭，輪完之前不重複完整配搭，輪換進度會保存。
- `node tests/v5.test.cjs` verifies collected-first opening, filter reset, all 10,872 unique prompt combinations and 1,000 nonrepeating footer combinations. Local logic and native Canvas tests only; mobile browser gestures still require device testing.

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
