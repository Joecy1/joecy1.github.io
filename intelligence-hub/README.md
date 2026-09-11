# Alumni Intelligence Hub draft

A reversible GitHub Pages draft for a relationship/community explorer.

## Current demo

- Dataset: `data/graph.json` (US Physical AI / Robotics / Intelligent Manufacturing scaffold)
- Renderer: Three.js loaded as an ES module in `src/main.js`
- UI: node search, type filter, reset view, click-to-inspect details and relationship list
- Hosting: compatible with this repository's existing GitHub Pages deployment

## Open locally

From the repository root:

```text
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/intelligence-hub/
```

The page must be served over HTTP because ES modules and `fetch()` are restricted when opening `index.html` directly as a `file://` URL.

## Data contract

- Markdown: research narrative, evidence notes, methodology
- CSV: human-friendly node/edge editing and import/export
- JSON: browser runtime graph data
- JavaScript: interaction and rendering logic
- Three.js: 3D canvas layer

## Deployment status

This is a draft only. It does not modify the portfolio homepage and has not been committed or pushed. Three.js is used under its MIT license; the license notice should remain in the final repository.

## Next step

Add a build step that validates `nodes` and `edges`, converts approved CSV/Markdown inputs to `data/graph.json`, and then deploys the static output through the existing Pages workflow.
