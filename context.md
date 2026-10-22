# Project Context: macOS Developer Portfolio (HarshitOS)

## 1. Overview & Objective
This project is an interactive, browser-based **macOS Desktop Developer Portfolio** ("HarshitOS") for **Harshit Tiwari** (Full Stack Developer & CSIT Student at IPS IES Academy).

The portfolio provides an authentic macOS desktop experience in the browser featuring:
- **Interactive Windows**: Draggable, resizable, and maximizable macOS windows with focus management (`z-index`).
- **All Projects App**: Fetches and displays all GitHub repositories live from `@harshit-tiwari-codebase` with live search, language filters, star counts, tags, source code, and live demo links, backed by a rate-limit-resilient fallback dataset.
- **macOS Dock**: Built with pure CSS parabolic wave magnification using CSS `:has(+ .icon:hover)` and adjacent sibling (`+`) selectors.
- **Control Center & Wallpaper Switcher**: Dynamic wallpaper switcher with 4 themes and `localStorage` persistence.
- **Entry Notification**: Sliding macOS frosted-glass push notification on load.
- **Desktop Shortcuts**: Clickable desktop folders and file shortcuts.
- **Interactive Terminal (CLI)**: Emulated command line supporting `projects`, `skills`, `education`, `open <app>`, and social commands.
- **Developer Apps**: GitHub workspace with contribution activity calendar, syntax-highlighted Notes viewer, interactive PDF Resume viewer, and embedded Spotify player.

---

## 2. Tech Stack & Dependencies

| Category | Technology / Package | Purpose |
| :--- | :--- | :--- |
| **Framework** | React 19 (`react`, `react-dom`) | UI components & reactivity |
| **Bundler** | Vite 8 (`vite`, `@vitejs/plugin-react`) | Rapid build tool and dev server |
| **Styling** | Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/vite`) | Utility-first responsive design |
| **Animation** | Framer Motion (`framer-motion`) | Window scaling, notifications, wallpaper crossfade |
| **Window Drag/Resize** | React-Rnd (`react-rnd`) | Drag-and-drop and resize handling for macOS windows |
| **Data Fetching** | Axios (`axios`) | GitHub REST API queries |
| **Terminal Emulator** | React-Console-Emulator (`react-console-emulator`) | In-browser command-line interface |
| **GitHub Calendar** | React-GitHub-Calendar (`react-github-calendar`) | SVG activity contribution chart |
| **Syntax Highlighting** | React-Syntax-Highlighter (`react-syntax-highlighter`) | Highlighted JavaScript code preview in Notes.js |
| **Icons** | Lucide-React & React-Icons (`lucide-react`, `react-icons`) | macOS, GitHub, and system icons |

---

## 3. Repository Architecture

```text
macos-dev-portfolio/
├── context.md                          # Comprehensive project context for AI/developers
├── index.html                          # Entry HTML with Apple icon favicon & metadata
├── package.json                        # Scripts and dependencies
├── vite.config.js                      # Vite configuration with Tailwind & React plugins
├── public/                             # Static assets served from root ("/")
│   ├── doc-icons/                      # Dock icon SVGs (projects, github, cli, note, pdf, etc.)
│   ├── documents/                      # Resume PDF & Notes.md
│   ├── images/                         # Wallpapers (e.g. stranger-things-3840x2160-18568.jpg)
│   └── navbar-icons/                   # Apple menu & Wi-Fi SVGs
└── src/
    ├── main.jsx                        # Application root entry point
    ├── index.css                       # Global styles & CSS Dock hover wave animation
    ├── App.jsx                         # Main desktop orchestrator & global state
    └── components/
        ├── DateTime.jsx                # Menu bar clock & date formatter
        ├── DesktopIcons.jsx            # Desktop folder/file shortcuts on wallpaper
        ├── Dock.jsx                    # Floating macOS dock with bounce/zoom animations
        ├── Navbar.jsx                  # Top menu bar, Apple menu, and quick actions
        ├── Notification.jsx            # Top-right push notification banner
        ├── ControlCenter.jsx           # Wallpaper switcher & quick toggles panel
        ├── Wallpaper.jsx               # Background image renderer with crossfade
        └── Windows/
            ├── MacWindow.jsx           # Reusable window shell (traffic lights, drag, maximize)
            ├── ProjectsWindow.jsx      # Dedicated GitHub projects app (search, filter, sort)
            ├── GitHubWindow.jsx        # GitHub profile & contribution calendar window
            ├── Cli.jsx                 # Interactive developer terminal emulator
            ├── Note.jsx                # Code/Notes reader with syntax highlighting
            ├── Resume.jsx              # PDF resume viewer with download option
            └── SpotifyWindow.jsx       # Embedded Spotify music player
```

---

## 4. Key Component Responsibilities & State Management

### A. `src/App.jsx`
- **`WindowState`**: Object map `{ projects, github, spotify, note, resume, cli }` tracking which windows are open.
- **`activeWindow`**: Tracks currently focused window ID (`'projects'`, `'cli'`, etc.) to dynamically lift it to the top `z-index`.
- **`currentWallpaper`**: Stores active wallpaper image URL, synced with browser `localStorage.getItem("macos_wallpaper")`.
- **`controlCenterOpen`**: Boolean toggling the Control Center dropdown.

### B. `src/components/Windows/ProjectsWindow.jsx`
- Fetches all public repositories from `https://api.github.com/users/harshit-tiwari-codebase/repos?per_page=100&sort=updated`.
- Combines live API data with a curated `FALLBACK_PROJECTS` array so that:
  - Repositories without a GitHub description still show clean, professional project summaries.
  - If GitHub rate limits unauthenticated requests (HTTP 403), cached project cards display seamlessly with an informative banner.
- **Search & Filters**: Real-time search across names, descriptions, and topics + category filter tabs (*All*, *JavaScript*, *TypeScript*, *AI & ML*, *Full Stack*) + sorting by date, stars, or name.

### C. `src/components/Dock.jsx` & `src/index.css`
- **CRITICAL ANIMATION REQUIREMENT**: Every icon in `Dock.jsx` must be a **direct child** element with `className="icon ..."` inside the parent dock flex container.
- **Animation Implementation in `src/index.css`**:
  ```css
  .icon {
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                filter 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .icon:hover {
    transform: translateY(-25%) scale(1.25);
  }
  .icon:hover + .icon {
    transform: translateY(-15%);
  }
  .icon:has(+ .icon:hover) {
    transform: translateY(-15%);
  }
  ```
  *(Do NOT wrap dock items in intermediate `<div>` wrappers, or the adjacent sibling `+` and `:has()` selectors will not match!)*

### D. `src/components/Windows/MacWindow.jsx`
- Wraps any window content with macOS styling.
- Traffic light buttons:
  - **Red**: Closes window (`WindowState[windowName] = false`).
  - **Yellow**: Minimizes window.
  - **Green**: Toggles maximize/restore mode to fill available desktop space.
- Brings window to front (`zIndex: 40` vs `25`) when clicked or dragged.

### E. `src/components/ControlCenter.jsx` & `Wallpaper.jsx`
- Exposes 4 pre-configured high-definition wallpapers (Stranger Things, macOS Graphic Sonoma, Yosemite Valley, and Neon Synthwave).
- Updates wallpaper state instantly with smooth fade animation and persists choice in `localStorage`.

### F. `src/components/Notification.jsx`
- Automatically triggers a sliding macOS notification banner 1.2s after mount.
- Provides a one-click button to open the **All Projects** window or dismiss manually.

---

## 5. Development Guidelines & Conventions

1. **Asset Paths**:
   - Always reference files in the `public/` folder using absolute root paths (e.g., `/doc-icons/projects.svg`, `/images/...`, `/documents/...`). Never use Windows-style backslashes or `public\...` in `img src` or `href`.
2. **Simple Code Principle**:
   - Keep components modular and self-contained without unnecessary complex state libraries (Redux, Zustand, etc.). Standard React `useState`, `useEffect`, and props are sufficient.
3. **Build & Test**:
   - Run `npm run dev` to start Vite local dev server.
   - Run `npm run build` to verify clean production bundles.
