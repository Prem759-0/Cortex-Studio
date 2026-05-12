# 🎨 Cortex Studio | Pro Art Engine



![Cortex Studio Header](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop)



[![React 18](https://img.shields.io/badge/React-18-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)

[![Vite](https://img.shields.io/badge/Vite-5-purple.svg?style=for-the-badge&logo=vite)](https://vitejs.dev/)

[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4.svg?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-black.svg?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

[![Zustand](https://img.shields.io/badge/Zustand-4-bear.svg?style=for-the-badge)](https://github.com/pmndrs/zustand)



Cortex Studio is a production-grade, highly interactive generative art playground and canvas editor. It combines a simulated AI prompt engine with a multi-layered HTML5 Canvas editor, featuring complex state management, history time-travel, and breathtaking glassmorphic micro-interactions.



## ✨ Elite Features



* **⚡ High-Performance Canvas:** Custom DOM rendering engine utilizing offscreen canvases for perfect opacity blending and multi-layer rendering at 60fps.

* **⏪ Time-Travel State (Undo/Redo):** Deep history stack management allowing infinite undo/redo capabilities across all layer and drawing modifications.

* **🖱️ Drag & Drop Layers:** Fluid layer reordering utilizing Framer Motion's advanced spring-physics `Reorder` API.

* **📐 Geometry Engine:** Real-time vector preview for rendering complex shapes (Circles, Rectangles) alongside perfect-freehand brush strokes.

* **🤖 AI Prompt Simulator:** A mock generative AI interface with style selectors, glowing typing effects, and asynchronous generation states.

* **💅 Ultra-Premium UI/UX:** Context-aware glassmorphism, dynamic Aurora background meshes, dark/light theme persistence, and meticulously crafted staggered animations.



## 🏗️ Architecture Breakdown



* **State Manager:** `Zustand` (chosen over Redux for boilerplate-free, hook-based immutable state updates ideal for rapid canvas tracking).

* **Animation Engine:** `Framer Motion` (handles layout ID shared transitions, spring-based toolbars, and exit animations).

* **Styling:** `Tailwind CSS` + Custom CSS Variables (`@layer base`) for rapid theme switching and complex backdrop-filters.

* **Routing:** React Router v6 setup for Vercel SPA compliance.



## 🚀 Quick Start (Local Setup)



```bash

# Install dependencies

npm install



# Start the Vite dev server

npm run dev

