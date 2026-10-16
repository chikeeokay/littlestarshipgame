# 無聊小島 · Little Joy Harbour

A Cantonese, one-minute star-catching game with a cat, paper boat, six collectible gifts, optional sound and local saved progress. No dependencies or backend required.

## Upload to GitHub

1. Extract little-joy-harbour.zip on your computer.
2. Create a new GitHub repository, for example `little-joy-harbour`.
3. Choose **Add file → Upload files**.
4. Upload the extracted `public` folder, `render.yaml` and this README into the repository root. Do not upload only the ZIP, and do not add an extra enclosing folder.
5. Commit the files and copy the repository URL.

Expected layout:
- public/index.html
- render.yaml
- README.md

## Deploy to Render

Connect this repository as a **Static Site** (not a server Web Service).
- Build command: `echo "Static game ready"`
- Publish directory: `public`
- Environment variables: none

Alternatively, create a Render Blueprint from this repository; `render.yaml` contains the configuration. Review Render's current plan and workspace usage before confirming.

## Play locally

Open `public/index.html` in a modern browser. Use left/right arrow keys, drag on the sea, or press the on-screen direction buttons. Catch five stars for a gift. Each round lasts 60 seconds. Misses do not deduct points. Pause is supported, and switching tabs automatically pauses the game.

Progress is stored in this browser's localStorage, not in an online account. Progress on the existing ChatGPT Site does not transfer automatically to a new Render domain. Clearing browser data removes the collection.

## Verification

JavaScript syntax and simulated gameplay checks passed: catching, rewards, pause/resume, round end, saving and restart. Real-browser visual QA was not completed.
