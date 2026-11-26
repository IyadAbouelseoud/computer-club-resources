# Computer Club workshop resources

Two static pages, no build step.

- `ccna/` LINK UP Field Kit (CCNA Fundamentals workshop)
- `ccna/lab/` HexNet Lab, the browser Cisco lab used in LINK UP (9 missions, Episode 3 of the Ali Baba story)
- `sql/` Shadow Lotus Loot Drop (Cyberpunk Heist SQL workshop)
- `index.html` small landing page that links to both

## Kids games (Arabic, ages 6-12)
Orphan-home visit with the Volunteer Club. No build step, no tracking, works offline once loaded.
- `kids/` hub (`kids/index.html`) with a staff panel mapping the workshop topics to the game rounds
- `kids/cave/` Cave Guardians (حرّاس كهف الكنز): 6 online-safety rounds, printable certificate
- `kids/caravan/` Little Programmers Caravan (قافلة المبرمجين الصغار): 11 short stages (sequences, loops, debugging, binary doors) with a "show me the solution" help button after two failed tries; `node kids/caravan/test.js` checks every level is solvable
- `kids/shared/` common CSS, inline-SVG art, synth sound effects, read-aloud helper
- `kids/assets/` optional PNG replacements for the built-in art: drop files named as in `kids/prompts/` and list them in `manifest.json`
- `kids/prompts/` Gemini image prompt library for those PNGs

## Deploy on GitHub Pages
1. Create a new public repository, for example `workshop-resources`.
2. Upload everything in this folder (keep the `ccna` and `sql` folders and the `.nojekyll` file).
3. Repository Settings, Pages, Source: "Deploy from a branch", branch `main`, folder `/ (root)`, Save.
4. After a minute the links are:
   - `https://YOUR-USERNAME.github.io/workshop-resources/ccna/`
   - `https://YOUR-USERNAME.github.io/workshop-resources/sql/`

## Programmer's Day (5 Nov 2026)
- `pd/arcade/` Club Arcade 2077: VAULT-7: RELOCKED (booth laptop game, works offline once loaded)
- `pd/vault/<slug>/` 8 Binary Vault exhibit pages, one per QR poster (slugs are fixed; do not rename or the QR codes break)
- `pd/vault/open/` the Binary Vault itself (booth laptop): enter the 8 bits, opens on the right code; first solver per shift = headphones, then keychains; the code is only stored as a PBKDF2 hash
- `pd/fury/` Keyboard Fury: `index.html` contestant screen, `board.html` live projector leaderboard, `sync.js` live sync (same laptop: automatic; two devices: same room code on both, uses ntfy.sh)
- `pd/index.html` hub linking the booth apps (vault pages are left off on purpose)
- `pd/fonts/` self-hosted fonts shared by all

## Levant booth: صندوق الدنيا · Sandouq El-Donya (cultural event)
One-screen booth game for a tablet or touch laptop. No build step, works offline once loaded.
- `levant/` the game: attract screen (golden hour countdown, shift leaderboard), pick a country, curtain reveal, 40-second hidden-object round, payout screen telling staff how many Donya Lira to pay and which Tile Card piece to stamp
- Staff panel: long-press the small red seal (bottom corner of the start screen) or Ctrl+Shift+S, PIN `2026` (change it inside). Switch girls/boys shift, clear board, start golden hour now, edit payouts and round length, see totals paid
- `levant/print/donya-lira-A4.pdf` 30 notes per A4 (12 × 10, 9 × 5, 6 × 25, 3 × 50), `levant/print/tile-card-A4.pdf` 12 Tile Cards per A4. The `.html` versions regenerate them (new serial numbers each print)
- `levant/prompts/` Gemini prompt library, PhotoCraft finishing steps and font list
- `levant/assets/` optional art from Gemini; list each file in `manifest.json` (keys `box`, `hakawati`, `scene-<sy|lb|ps|jo>`, `item-<id>`, `lira-<5|10|25|50>`)
