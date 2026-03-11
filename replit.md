# Neeranjan Shankar Portfolio

A static personal portfolio website for Neeranjan Shankar, an AI enthusiast and n8n automation builder.

## Project Structure

```
.
├── index.html       # Main portfolio page
├── style.css        # All styling
├── script.js        # Animations and interactivity
└── Assets/          # Images and media
    ├── Profile/     # Profile photo
    ├── logos/       # Tool logos (Claude, n8n, OpenAI)
    ├── projects/    # Project screenshots
    └── linkedin_posts/ # LinkedIn post images
```

## Tech Stack

- Pure HTML, CSS, JavaScript (no build system or framework)
- Served via `npx serve` on port 5000

## Running Locally

The workflow "Start application" runs:
```
npx serve -s . -l 5000
```

## Deployment

Configured as a **static** deployment with `publicDir: "."`.
