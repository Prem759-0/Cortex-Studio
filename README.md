# 🌌 Cortex Studio | v4.0 Ultimate Edition

![Cortex Studio Header](https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2564&auto=format&fit=crop)

[![React 18](https://img.shields.io/badge/React-18-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple.svg?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4.svg?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-black.svg?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

Cortex Studio is a God-Tier, production-ready frontend application. It bridges the gap between a generative AI lab and a professional graphic design suite (like Figma and Canva), engineered entirely in the browser using advanced mathematics and the HTML5 Canvas API.

## 🚀 Architectural Masterpieces

### 1. The Spatial Canvas Engine
* **Infinite Panning & Zooming:** Seamless workspace navigation using CSS 2D Transforms (`matrix` and `scale`) uncoupled from the actual Canvas resolution to maintain crisp 60fps rendering.
* **Perfect Coordinate Mapping:** Matrix math translates client viewport `(x,y)` clicks to exact Canvas coordinates regardless of the current zoom level or pan offset.
* **Hardware Accelerated Layers:** Renders using an Offscreen Canvas buffering strategy.

### 2. Real-Time Image Processing (Photoshop-Grade)
* **Layer-Specific Filters:** Real-time `brightness`, `contrast`, and `blur` calculations applied natively via the `ctx.filter` API during the render loop.
* **Advanced Blend Modes:** Supports `multiply` (Highlighter), `screen` (Neon Glow), and `destination-out` (Eraser) composite operations.

### 3. The Time Machine (State Management)
* **Deep History Stack:** Built on `Zustand`. Implements a highly optimized, immutable 20-step history array.
* **Ctrl+Z / Ctrl+Y Interception:** Native keyboard event listeners for instant Time-Travel debugging and undo/redo operations.

### 4. Advanced Micro-Interactions
* **Fluid Reordering:** Layers panel utilizes Framer Motion's physical spring physics (`<Reorder.Group>`) for buttery-smooth drag-and-drop.
* **Contextual Glassmorphism:** Dynamic `backdrop-blur` and responsive border opacities that react to the application's global Dark/Light theme toggle.

## 💻 Local Development

```bash
# Clone the repository
git clone [https://github.com/yourusername/cortex-studio.git](https://github.com/yourusername/cortex-studio.git)

# Install dependencies
npm install

# Start the Vite hyper-fast dev server
npm run dev
