# Neeranjan Shankar Portfolio

A static personal portfolio website for Neeranjan Shankar, an AI enthusiast and n8n automation builder.

## Design Style

Retro + Brutalism UI: cream background (#F5F0E8), thick black borders with offset drop-shadows, flat solid-color panels, monospace body font (Space Mono), bold display font (Bebas Neue), and high-contrast accent colors (electric yellow, raw red, retro green).

## Project Structure

```
.
├── index.html       # Main portfolio page
├── style.css        # All styling (brutalist/retro theme)
├── script.js        # Animations and interactivity
└── Assets/          # Images and media
    ├── Profile/     # Profile photo
    ├── logos/       # Tool logos (Claude, n8n, OpenAI)
    ├── projects/    # Project screenshots
    └── linkedin_posts/ # LinkedIn post images
```

## Tech Stack

- Pure HTML, CSS, JavaScript (no build system or framework)
- Google Fonts: Space Mono (body), Bebas Neue (headings)
- Served via `npx serve` on port 5000

## Running Locally

The workflow "Start application" runs:
```
npx serve -s . -l 5000
```

## Deployment

Configured as a **static** deployment with `publicDir: "."`.
