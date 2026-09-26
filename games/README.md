# Adding a new mini-game

Every game is one self-contained `.html` file in this folder. Copy `times-tables.html` or `phonics-match.html` as a starting point rather than starting from scratch — they already implement the contract below correctly.

## Contract every game must follow

1. **Read its own settings from the URL.** e.g. `?table=3` or `?set=satp`. The app always also appends `childId`, `lessonId`, and `subject` — read these too, you'll need them to report completion.
2. **Report completion.** When the child finishes, call:
   ```js
   window.parent.postMessage({ type: 'activityComplete', id: lessonId, childId, subject, score }, '*');
   ```
   If the game isn't running inside a frame (our current shell navigates in-place, not via iframe), fall back to:
   ```js
   localStorage.setItem('fs:pendingComplete', JSON.stringify({ id: lessonId, childId, subject }));
   window.location.href = '../index.html#/kid/' + childId;
   ```
   Both example games already do this — copy the `finish()` function as-is.
3. **Auto-save progress every ~5 seconds** to `localStorage` under key `progress:{childId}:{lessonId}`, and **restore it on load** if present. This is what makes "come back later" work — a child can close the tablet mid-game and pick up where they left off.
4. **No numbers, no losing.** Never show a percentage or "you lost" screen. Wrong answers get a gentle "Try again!" and another attempt at the same question — never a fail state.
5. **Big touch targets** (44px minimum), works at 390px width, no small text.

## Adding it to the app

Add an entry to `/data/lessons.json` with `"type": "game"` and `"gameFile": "games/your-game.html?yourParam=value"`. That's the only other file you need to touch — the home screen picks it up automatically.
