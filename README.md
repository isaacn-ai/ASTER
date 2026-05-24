# ASTER

ASTER is the website foundation for **Aster Frame**, an AI-native commercial film studio.

## Important constraint
The root `index.html` is treated as canonical and preserved as the visual/structural source of truth. All enhancements in this repository are additive (new CSS/JS/assets and deployment files).

## Included assets
- `assets/css/main.css` design tokens and theme variables.
- `assets/css/animations.css` animation utilities and reduced-motion guardrails.
- `assets/css/chatbot.css` chatbot visual primitives.
- `assets/js/main.js` theme + contact integration helpers.
- `assets/js/animations.js` IntersectionObserver helper.
- `assets/js/chatbot.js` secure-config chatbot module with offline mode.

## Deployment
This repository is static HTML/CSS/JS. GitHub Pages can publish directly from branch root without a build step.

## Security notes
- No API keys are committed.
- Chatbot API config values are intentionally blank.
- User message input is sanitized with DOMPurify when available.
