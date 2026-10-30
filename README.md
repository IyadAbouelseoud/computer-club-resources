# Computer Club workshop resources

Two static pages, no build step.

- `ccna/` LINK UP Field Kit (CCNA Fundamentals workshop)
- `sql/` Shadow Lotus Loot Drop (Cyberpunk Heist SQL workshop)
- `index.html` small landing page that links to both

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
- `pd/fury/` Keyboard Fury: `index.html` contestant screen, `board.html` live projector leaderboard, `sync.js` live sync (same laptop: automatic; two devices: same room code on both, uses ntfy.sh)
- `pd/index.html` hub linking the booth apps (vault pages are left off on purpose)
- `pd/fonts/` self-hosted fonts shared by all
