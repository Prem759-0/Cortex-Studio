import React from 'react';
import { motion } from 'framer-motion';
import { 
  Palette, 
  Wand2, 
  Download, 
  Eraser, 
  Type, 
  Moon, 
  Sun, 
  History,
  Layout,
  MousePointer2,
  Share2
} from 'lucide-react';

import { CanvasArea } from './components/Canvas/CanvasArea';
import { LayersPanel } from './components/Canvas/LayersPanel';
import { PromptBar } from './components/PromptEngine/PromptBar';
import { GenerationGallery } from './components/PromptEngine/GenerationGallery';
import { IconButton } from './components/UI/IconButton';
import { useCanvasStore } from './store/useCanvasStore';

const App: React.FC = () => {
  const { 
    activeTool, 
    setTool, 
    brushColor, 
    setBrushColor, 
    brushSize, 
    setBrushSize 
  } = useCanvasStore();

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="relative h-screen w-screen flex flex-col bg-background text-foreground transition-colors duration-500">
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[120px] animate-pulse delay-700" />
      </div>

      {/* Header Navigation */}
      <header className="h-16 border-b border-border bg-background/50 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ rotate: 15 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20"
          >
            <Palette className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h1 className="font-display font-bold text-lg leading-none tracking-tight">Cortex Studio</h1>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">v1.0 Pro Art Engine</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-secondary/50 rounded-xl p-1 border border-border">
            <IconButton icon={<History className="w-4 h-4" />} className="p-2 h-9 w-9" />
            <IconButton icon={<Share2 className="w-4 h-4" />} className="p-2 h-9 w-9" />
          </div>
          <div className="w-px h-6 bg-border mx-2" />
          <IconButton 
            onClick={toggleTheme}
            icon={<><Sun className="w-5 h-5 dark:hidden" /><Moon className="w-5 h-5 hidden dark:block" /></>} 
          />
          <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-primary/20 flex items-center gap-2 group">
            <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            Export
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        
        {/* Left Floating Toolbar */}
        <motion.aside 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-16 glass-panel rounded-2xl flex flex-col items-center py-6 gap-4 z-40"
        >
          <IconButton 
            active={activeTool === 'move'} 
            onClick={() => setTool('move')} 
            icon={<MousePointer2 className="w-5 h-5" />} 
          />
          <IconButton 
            active={activeTool === 'brush'} 
            onClick={() => setTool('brush')} 
            icon={<Palette className="w-5 h-5" />} 
          />
          <IconButton 
            active={activeTool === 'eraser'} 
            onClick={() => setTool('eraser')} 
            icon={<Eraser className="w-5 h-5" />} 
          />
          <IconButton icon={<Type className="w-5 h-5" />} />
          
          <div className="w-8 h-px bg-border my-2" />
          
          {/* Color Picker */}
          <div className="relative group">
            <input 
              type="color" 
              value={brushColor}
              onChange={(e) => setBrushColor(e.target.value)}
              className="w-8 h-8 rounded-lg cursor-pointer appearance-none bg-transparent overflow-hidden"
            />
            <div 
              className="absolute inset-0 rounded-lg pointer-events-none ring-2 ring-offset-2 ring-transparent group-hover:ring-primary/50 transition-all"
              style={{ backgroundColor: brushColor }}
            />
          </div>

          <div className="flex-1" />
          
          <IconButton icon={<Layout className="w-5 h-5" />} />
        </motion.aside>

        {/* Central Creative Core */}
        <main className="flex-1 flex flex-col gap-4 min-w-0 overflow-hidden">
          {/* Top Prompt Section */}
          <section className="shrink-0">
            <PromptBar />
          </section>

          {/* Canvas Component */}
          <section className="flex-1 relative glass-panel rounded-3xl overflow-hidden shadow-2xl border-white/5">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-background/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-border shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Brush Size</span>
              <input 
                type="range" 
                min="1" 
                max="100" 
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="w-24 h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span className="text-[10px] font-mono font-bold w-6">{brushSize}px</span>
            </div>
            <CanvasArea />
          </section>
        </main>

        {/* Right Asset & Layer Panel */}
        <motion.aside 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-80 flex flex-col gap-4 shrink-0"
        >
          {/* Layers Section */}
          <div className="flex-1 glass-panel rounded-2xl p-5 overflow-hidden flex flex-col">
            <LayersPanel />
          </div>

          {/* AI Gallery Section */}
          <div className="h-[40%] glass-panel rounded-2xl p-5 overflow-y-auto">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <Wand2 className="w-4 h-4" />
              <h3 className="font-semibold text-sm uppercase tracking-wider">AI Lab</h3>
            </div>
            <GenerationGallery />
            {/* Empty State for Gallery */}
            {useCanvasStore.getState().generatedImages.length === 0 && (
              <div className="h-32 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 text-muted-foreground opacity-50">
                <Layout className="w-6 h-6" />
                <span className="text-[10px] font-medium">No assets generated</span>
              </div>
            )}
          </div>
        </motion.aside>
      </div>
    </div>
  );
};

export default App;
