# bDevStudios site

Public pages for bDevStudios games, served by GitHub Pages: a home page plus each game's privacy policy (Google Play needs a public link).

| Page | Path |
|---|---|
| Home | `index.html` |
| Eleventy1111 privacy policy | `eleventy1111/privacy/index.html` (source of truth: `docs/privacy-policy.md` in the Eleventy1111 repo) |

Adding a game: create `<game>/privacy/index.html` (copy Eleventy1111's as a template), add a card to `index.html`, commit and push. Pages publishes within a minute or two.

Shared look: `assets/site.css`. `.nojekyll` tells GitHub Pages to serve the files as-is.
