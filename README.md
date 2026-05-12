# 🌌 Cortex Studio | v5.0 Ultimate Edition

![Cortex Studio Header](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop)

[![React 18](https://img.shields.io/badge/React-18-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple.svg?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4.svg?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-black.svg?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
[![Zustand](https://img.shields.io/badge/Zustand-4-bear.svg?style=for-the-badge)](https://github.com/pmndrs/zustand)

**Cortex Studio** is a production-grade, highly interactive generative art playground and canvas editor. It bridges the gap between an AI prompting interface and a professional graphic design suite (like Figma or Canva), engineered entirely in the browser using advanced mathematics and the HTML5 Canvas API.

---

## ✨ God-Tier Features (v5.0 Exclusives)

* 🗺️ **Spatial Canvas Engine:** Infinite panning (Spacebar + Drag) and zooming (Mouse Wheel or UI) using CSS 2D Transforms (`matrix` and `scale`). Perfect coordinate mapping translates viewport clicks to exact Canvas coordinates regardless of zoom level.
* 💾 **Native `.cortex` File Format:** True persistence. Save your entire workspace—including all layers, strokes, filters, and history states—to a local JSON-based `.cortex` file and load it back anytime.
* 🎛️ **Real-Time Layer Processing:** Apply real-time Brightness, Contrast, and Blur adjustments to individual layers mathematically at 60fps using the `ctx.filter` API.
* 🏁 **Advanced Export Engine:** Professional rendering pipeline that compiles the offscreen canvases into a single downloadable image, featuring a **Transparent PNG** toggle for graphic design workflows.
* 📐 **Engineering Grid:** A scalable, mathematically perfect background grid system that syncs perfectly with your zoom and pan coordinates for precise drafting.

## 🛠️ Core Capabilities

* ⚡ **High-Performance Canvas:** Custom DOM rendering engine utilizing offscreen canvases for perfect opacity blending, complex blend modes (`multiply`, `screen`, `destination-out`), and multi-layer rendering.
* ⏪ **Time-Travel State (Undo/Redo):** Deep history stack management powered by Zustand, allowing up to 30 levels of infinite undo/redo capabilities across all modifications.
* 🖱️ **Drag & Drop Layers:** Fluid layer reordering utilizing Framer Motion's advanced spring-physics `<Reorder>` API.
* 🖌️ **Advanced Brush Engine:** Features perfect-freehand rendering, a Highlighter tool, Neon Glow brushes, and real-time vector previews for shapes (Circles, Rectangles).
* 🤖 **AI Prompt Simulator:** A mock generative AI interface with Midjourney-style aspect ratio selectors, art style chips, glowing typing effects, and asynchronous generation states.
* 💅 **Ultra-Premium UI/UX:** Context-aware glassmorphism, dynamic Aurora background meshes, dark/light theme persistence, and meticulously crafted staggered animations.

---

## 🏗️ Architecture & Tech Stack

* **State Manager (`Zustand`):** Chosen over Redux for boilerplate-free, hook-based immutable state updates. Manages the 30-step history array without memory leaks.
* **Animation Engine (`Framer Motion`):** Handles layout ID shared transitions, spring-based toolbars, drag-and-drop layer sorting, and exit animations.
* **Styling (`Tailwind CSS`):** Utilizes Custom CSS Variables (`@layer base`) for rapid theme switching, complex backdrop-filters, and tailored scrollbars.
* **Routing (`React Router v6`):** Standardized SPA navigation perfectly configured for Vercel deployments.

---

## ⌨️ Keyboard Shortcuts

Cortex Studio is built for power users. Master the workspace with these shortcuts:

| Action | Shortcut |
| :--- | :--- |
| **Undo** | `Ctrl + Z` or `Cmd + Z` |
| **Redo** | `Ctrl + Y`, `Cmd + Y`, or `Ctrl + Shift + Z` |
| **Pan Canvas** | Hold `Spacebar` + Click & Drag |
| **Zoom In/Out** | `Ctrl` + `Mouse Wheel` |

---

## 📂 Project Structure

```text
cortex-studio/
├── public/                 # Static assets (favicons, etc.)
├── src/
│   ├── components/
│   │   ├── Canvas/         # Core rendering engine, offscreen logic, and Grid
│   │   ├── PromptEngine/   # AI generation simulation and UI
│   │   └── UI/             # Reusable glassmorphic buttons and tooltips
│   ├── store/
│   │   └── useCanvasStore.ts # Global Zustand state, History, and Tool logic
│   ├── App.tsx             # Main layout shell, toolbars, and event listeners
│   ├── index.css           # Tailwind directives and CSS variables
│   └── main.tsx            # React DOM entry point
├── package.json
├── tailwind.config.js      # Custom theme colors and animation keyframes
├── vercel.json             # SPA routing fallback config
└── vite.config.ts
