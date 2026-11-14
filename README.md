# 🍎 HarshitOS — macOS Developer Portfolio

An interactive, fluid browser-based desktop operating system inspired by **macOS Sonoma** & **macOS Tahoe**. Designed and engineered by **Harshit Tiwari** to showcase projects, skills, developer journey, and technical craftsmanship.

[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Lenis](https://img.shields.io/badge/Lenis-Smooth_Scroll-black?style=flat-square)](https://lenis.darkroom.engineering/)

---

## ✨ Features & Highlights

### 🖥️ Authentic macOS Desktop Environment
- **Refined Liquid Glass Dock:**
  - True background refraction with SVG `feTurbulence` + `feDisplacementMap` (Chromium) and high-blur fallback (Safari/Firefox).
  - Apple-style squircle icons with top-to-bottom specular highlights, subtle inner rim borders, and responsive spring animations.
  - Authentic metallic wire-ribbed **Trash Can icon** with lid and contour gradients.
  - Tuned magnification physics (`MAGNIFY: 1.25`, `RANGE: 95px`) for a balanced, non-oversized look.
  - App launch bounce animation, active status running indicator dots, and frosted tooltip pills.
- **Desktop Widgets:**
  - 60 FPS requestAnimationFrame **Analog Clock** widget with world city cycling (Indore, Cupertino, London, Tokyo) and sweeping orange second hand.
  - Sonoma-style **Calendar Widget** featuring Day/Up Next view and a full interactive month view.
  - Ambient fade transitions when windows are active.
- **Top Menu Bar & Control Center:**
  - Dynamic time & date, customizable settings, volume/brightness toggles, and multi-wallpaper switcher.
  - System-wide **Spotlight Search** (`Cmd + K` / `Ctrl + K`) with instant keyboard navigation.
- **Multilingual Support:**
  - Instant toggle between **English** and **Hindi (हिंदी)** powered by `i18next`.

---

### 📱 Built-in Apps & Windows

| App | Description |
|---|---|
| **🧭 My Journey** | Immersive full-screen animated developer roadmap with milestone timeline, interactive skill stack, and project highlights. |
| **🎵 Vision Music** | Full-fledged audio player with custom audio engine, track scrubber, volume control, like system, playlist management, and Seedhe Maut hero banner. |
| **📁 Projects** | Categorized showcase of GitHub repositories with live links, tech tags, search, and dynamic filtering. |
| **💻 Interactive CLI** | Functional in-browser terminal emulator supporting built-in commands (`help`, `projects`, `clear`, `contact`, `theme`). |
| **🐙 GitHub Explorer** | Live GitHub profile metrics, contribution graph integration, and repository stats. |
| **📝 Notes** | Developer documentation, architectural thoughts, and personal notes viewer. |
| **📄 Resume** | High-definition PDF resume preview and one-click download. |
| **✍️ Blog** | Curated articles and dev write-ups directly synced with Dev.to. |
| **📬 Contact** | Functional contact sheet for recruiter inquiries and collaboration. |

---

## 🛠️ Tech Stack & Architecture

- **Core:** [React 19](https://react.dev/), [Vite 8](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation & Physics:** [Framer Motion 12](https://www.framer.com/motion/), [GSAP 3](https://greensock.com/gsap/)
- **Smooth Scrolling:** [Lenis](https://lenis.darkroom.engineering/) (Global integration + StoryPage)
- **Window Management:** [react-rnd](https://github.com/bokuweb/react-rnd) for draggable & resizable multi-window workspace
- **Internationalization:** [i18next](https://www.i18next.com/) & [react-i18next](https://react.i18next.com/)
- **Icons:** [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** `^20.19.0` or `>=22.12.0` (required by Vite 8)
- **Package Manager:** `npm`, `pnpm`, or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/harshit-tiwari-codebase/macos-dev-portfolio.git
   cd macos-dev-portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview the production build:**
   ```bash
   npm run preview
   ```

### Environment configuration

Copy `.env.example` to `.env.local` for local configuration. The contact form uses
EmailJS only when all three `VITE_EMAILJS_*` values are set; otherwise, it opens a
prefilled email draft. `VITE_DEVTO_USERNAME` optionally selects the DEV Community
account used by the blog window. Vite embeds `VITE_*` values in the client bundle,
so do not put private credentials in them. Set any desired values in your hosting
provider's build environment before deploying.

---

## 🚢 Deployment

The project is fully optimized for static zero-config hosting on modern cloud platforms:

### Deploy to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### Deploy to Netlify
- **Build command:** `npm run build`
- **Publish directory:** `dist`

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Cmd + K` / `Ctrl + K` | Open Spotlight Search |
| `Esc` | Close Story Mode / Dismiss modals |

---

## 👤 Author

**Harshit Tiwari**
- **GitHub:** [@harshit-tiwari-codebase](https://github.com/harshit-tiwari-codebase)
- **LinkedIn:** [Harshit Tiwari](https://www.linkedin.com/in/harshit-tiwari-48830b3b4/)
- **Email:** harshittiwari20044@gmail.com

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
