# Implementation notes

See the [README](../README.md) for setup, configuration, commands, deployment, and the current repository map.

## Architecture

- `src/main.jsx` mounts the app in `src/app/App.jsx`.
- `src/app/App.jsx` owns shared desktop state and composes the feature areas.
- `src/features/desktop/` contains the desktop shell and its controls.
- `src/features/windows/MacWindow.jsx` is the shared frame used by app windows.
- `src/features/story/` contains the portfolio story and scroll-path animation.
- Static assets live in `public/` and are referenced with root-relative URLs such as `/images/story-folder.svg`.

## External integrations

- GitHub's public API provides repository and profile data; unauthenticated requests may be rate-limited.
- DEV Community supplies the blog feed.
- EmailJS is optional; without its configuration, the contact form opens a prefilled email draft.
- Spotify and remote wallpaper images require an internet connection.
