# InfiniteUrban — Project Page

A clean, modern GitHub Pages site for the paper:

> **InfiniteUrban: A Unified Framework for Controllable Urban Scene Generation
> and Multi-Channel Dataset Construction**

## Project Structure

```
InfiniteUrban.github.io/
├── index.html        # Main page
├── style.css         # Styles (dark, gradient, glassmorphism)
├── script.js         # Reveal-on-scroll, counters, particles, copy buttons
├── images/           # Drop teaser.svg / fig1..fig6.svg here
└── README.md
```

> Note: This page is anonymized for double-blind review. Author names,
> emails, and institutions are intentionally withheld until acceptance.

## Quick Start

1. Drop your figures into `images/` (see `images/README.md`).
2. Links currently configured in `index.html`:
   - **Paper button** — disabled; arXiv link to be released after acceptance.
   - **Code button** — anonymous code repository.
   - **Dataset button** — Baidu Cloud download (extraction code shown on page).
3. Enable GitHub Pages on the repository to publish the site.

### Local preview

Use any static file server, e.g.:

```bash
# Python 3
python -m http.server 8080
# then visit http://localhost:8080
```

Or with Node.js:

```bash
npx serve .
```

## Customization Tips

- Colors live in `:root` at the top of `style.css` (`--brand-1`, `--brand-2`, …).
- The animated background is rendered to a `<canvas>` in `script.js` — you can tune
  `COUNT` and `MAX_DIST` to make it denser or lighter.
- All sections are reveal-animated; add the `reveal` class to any new block.

## License

Site code: MIT. Paper content / figures: © the authors.
