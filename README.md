# Family School

A free, no-login home-schooling app for Charlie and Naomi. Static site — no server, no paid services.

## How to add content (do this often, it's quick)

All content lives in `/data` as plain JSON. You never need to touch any `.html` or `.js` file for ordinary updates.

- **New video or activity** → add an entry to `data/lessons.json`.
- **New subject/topic** → add an entry to `data/subjects.json` (pick an icon name from the list in `js/app.js`'s `ICONS` object, or ask Claude to add a new one).
- **New badge** → add an entry to `data/badges.json`. Rule-based badges (`rule: {...}`) unlock automatically from usage. Set `"parentAwarded": true` instead for real-world things the app can't observe (a dance class, a theatre term) — you tick these off yourself from the parent dashboard.
- **Real-world milestone** (Half Moon, ballet, piano practice, book sales) → add an entry to `data/lessons.json` with `"type": "milestone"` — it shows as a log entry the child can tap to mark done, no in-app content required.

Edit the file on github.com directly (pencil icon on the file page), commit, and it's live in about a minute.

## How to open the parent dashboard

Long-press the small icon in the top-right corner of either child's home screen for about a second.

## Setting up cross-device progress logging (optional)

By default progress is saved on-device only (instant, works offline). To also get a combined log you can check from your phone:

1. Create a free Google Form with fields: childId, lessonId, subject, eventType, note.
2. Get each field's pre-filled entry ID (Form menu → "Get pre-filled link", fill dummy answers, copy the resulting URL — each field shows as `entry.XXXXXXX=...`).
3. Paste the form's submission URL and each entry ID into `js/progress.js` at the top (`GOOGLE_FORM_URL` and `GOOGLE_FORM_FIELDS`).

Until you do this, the app works exactly the same — it just skips the cross-device log.

## Local testing

Any static file server works, e.g. from this folder: `python3 -m http.server 8000`, then open `http://localhost:8000`.

## Hosting for free

Push this folder to a GitHub repo, then in the repo's Settings → Pages, set the source to the `main` branch. Your live URL will be `https://<your-username>.github.io/<repo-name>/`.
