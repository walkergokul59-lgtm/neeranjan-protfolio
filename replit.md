# Neeranjan Shankar Portfolio

A static personal portfolio website for Neeranjan Shankar, an AI enthusiast and n8n automation builder.

## Design Style

Dark professional theme with retro character. Deep charcoal background (#111111), surface panels (#161616), subtle dot-grid texture. Follows the 80/15/5 color rule: 80% neutral (black/gray), 15% primary (yellow #FFD400), 5% accent (blue #4F8CFF, purple #9B5CF6, teal #00D1B2, orange #FF6B00). Typography: Space Mono (body), Bebas Neue (headings). Soft shadows with subtle borders (#2A2A2A).

## Color Palette

- Background: #111111
- Surface: #161616
- Text: #D1D1D1 (body), #9A9A9A (secondary), #FFFFFF (headings)
- Accent Yellow: #FFD400
- Accent Blue: #4F8CFF
- Accent Purple: #9B5CF6
- Accent Teal: #00D1B2
- Accent Orange: #FF6B00

## Project Structure

```
.
├── index.html       # Main portfolio page
├── style.css        # All styling (dark theme)
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
