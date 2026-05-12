import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, Download, Eraser, Moon, Sun, Upload,
  Layout, MousePointer2, Square, Circle, Grid3X3, Trash2,
  Undo2, Redo2, Highlighter, Sparkles, Hand, Save
} from 'lucide-react';

import { CanvasArea } from './components/Canvas/CanvasArea';
import { LayersPanel } from './components/Canvas/LayersPanel';
import { PromptBar } from './components/PromptEngine/PromptBar';
import { GenerationGallery } from './components/PromptEngine/GenerationGallery';
import { IconButton } from './components/UI/IconButton';
import { useCanvasStore } from './store/useCanvasStore';

const App: React.FC = () => {
  const { 
    activeTool, setTool, brushColor, setBrushColor, brushSize, setBrushSize,
    undo, redo, historyIndex, history, showGrid, setShowGrid, layers, loadProject, clearCanvas
  } = useCanvasStore();

  const [showExportModal, setShowExportModal] = useState(false);
  const [exportTransparent, setExportTransparent] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleTheme = () => document.documentElement.classList.toggle('dark');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); if (e.shiftKey) redo(); else undo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') { e.preventDefault(); redo(); }
      if (e.code === 'Space') { e.preventDefault(); setTool('pan'); }
    };
    const handleKeyUp = (e: KeyboardEvent) => { if (e.code === 'Space') setTool('brush'); };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); };
  }, [undo, redo, setTool]);

  const handleExportPNG = () => {
    const canvas = document.getElementById('cortex-main-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = canvas.width; finalCanvas.height = canvas.height;
    const ctx = finalCanvas.getContext('2d');
    if (!ctx) return;
    if (!exportTransparent) { ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#18181b' : '#ffffff'; ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height); }
    ctx.drawImage(canvas, 0, 0);
    const link = document.createElement('a');
    link.download = `Cortex_Export_${Date.now()}.png`;
    link.href = finalCanvas.toDataURL('image/png');
    link.click();
    setShowExportModal(false);
  };

  const handleSaveProject = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ version: "5.0", layers }));
    const link = document.createElement('a');
    link.download = `Project_${Date.now()}.cortex`;
    link.href = dataStr;
    link.click();
    setShowExportModal(false);
  };

  const handleLoadProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        loadProject(json);
      } catch (err) { alert("Invalid .cortex file format."); }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="relative h-screen w-screen flex flex-col bg-background text-foreground transition-colors duration-500 overflow-hidden">
      <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <motion.div whileHover={{ rotate: 15 }} className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
            <Palette className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h1 className="font-display font-bold text-lg leading-none tracking-tight">Cortex Studio</h1>
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold">v5.0 Pro</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-secondary/50 rounded-xl p-1 border border-border">
            <button onClick={undo} disabled={historyIndex === 0} className="p-2 rounded-lg hover:bg-background disabled:opacity-30 transition-colors"><Undo2 className="w-4 h-4" /></button>
            <button onClick={redo} disabled={historyIndex === history.length - 1} className="p-2 rounded-lg hover:bg-background disabled:opacity-30 transition-colors"><Redo2 className="w-4 h-4" /></button>
          </div>
          
          <input type="file" accept=".cortex" ref={fileInputRef} onChange={handleLoadProject} className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-secondary rounded-xl transition-colors text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm font-medium">
            <Upload className="w-4 h-4" /> Open
          </button>

          <IconButton onClick={toggleTheme} icon={<><Sun className="w-5 h-5 dark:hidden" /><Moon className="w-5 h-5 hidden dark:block" /></>} />
          
          <div className="relative">
            <button onClick={() => setShowExportModal(!showExportModal)} className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-primary/20 flex items-center gap-2 group">
              <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" /> Save
            </button>
            
            <AnimatePresence>
              {showExportModal && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-2xl shadow-2xl p-4 flex flex-col gap-4">
                  <h4 className="font-bold text-sm">Save Options</h4>
                  <button onClick={handleSaveProject} className="w-full py-2.5 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
                    <Save className="w-4 h-4" /> Save Project (.cortex)
                  </button>
                  <hr className="border-border" />
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative flex items-center">
                      <input type="checkbox" checked={exportTransparent} onChange={(e) => setExportTransparent(e.target.checked)} className="peer sr-only" />
                      <div className="w-10 h-6 bg-secondary rounded-full peer-checked:bg-primary transition-colors"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                    </div>
                    <span className="text-sm font-medium">Transparent PNG</span>
                  </label>
                  <button onClick={handleExportPNG} className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold text-sm transition-colors">Export Image</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        <motion.aside initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-16 glass-panel rounded-2xl flex flex-col items-center py-6 gap-2 z-40 overflow-y-auto no-scrollbar border border-white/10 shadow-xl">
          <IconButton active={activeTool === 'move'} onClick={() => setTool('move')} icon={<MousePointer2 className="w-5 h-5" />} />
          <IconButton active={activeTool === 'pan'} onClick={() => setTool('pan')} icon={<Hand className="w-5 h-5" />} />
          <div className="w-8 h-px bg-border my-1" />
          <IconButton active={activeTool === 'brush'} onClick={() => setTool('brush')} icon={<Palette className="w-5 h-5" />} />
          <IconButton active={activeTool === 'highlighter'} onClick={() => setTool('highlighter')} icon={<Highlighter className="w-5 h-5" />} />
          <IconButton active={activeTool === 'neon'} onClick={() => setTool('neon')} icon={<Sparkles className="w-5 h-5" />} />
          <IconButton active={activeTool === 'eraser'} onClick={() => setTool('eraser')} icon={<Eraser className="w-5 h-5" />} />
          <div className="w-8 h-px bg-border my-1" />
          <IconButton active={activeTool === 'rect'} onClick={() => setTool('rect')} icon={<Square className="w-5 h-5" />} />
          <IconButton active={activeTool === 'circle'} onClick={() => setTool('circle')} icon={<Circle className="w-5 h-5" />} />
          <div className="w-8 h-px bg-border my-1" />
          <IconButton active={showGrid} onClick={() => setShowGrid(!showGrid)} icon={<Grid3X3 className="w-5 h-5" />} />
          <IconButton onClick={() => { if(window.confirm('Clear entire canvas?')) clearCanvas(); }} icon={<Trash2 className="w-5 h-5 text-red-500" />} />
          
          <div className="flex-1" />
          <div className="relative group p-2 mb-2">
            <input type="color" value={brushColor} onChange={(e) => setBrushColor(e.target.value)} className="w-8 h-8 rounded-full cursor-pointer appearance-none bg-transparent overflow-hidden shadow-inner" />
            <div className="absolute top-2 left-2 right-2 bottom-2 rounded-full pointer-events-none ring-2 ring-offset-2 ring-transparent group-hover:ring-primary/50 transition-all" style={{ backgroundColor: brushColor }} />
          </div>
        </motion.aside>

        <main className="flex-1 flex flex-col gap-4 min-w-0 overflow-hidden relative">
          <section className="absolute top-4 left-0 right-0 z-50 pointer-events-none">
            <div className="pointer-events-auto w-full flex justify-center"><PromptBar /></div>
          </section>
          
          <section className="flex-1 relative rounded-3xl overflow-hidden shadow-2xl border border-border bg-zinc-100 dark:bg-zinc-900">
            <CanvasArea />
          </section>
        </main>

        <motion.aside initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-80 flex flex-col gap-4 shrink-0 z-40">
          <div className="flex-1 glass-panel border border-white/10 rounded-2xl p-5 overflow-hidden flex flex-col shadow-xl"><LayersPanel /></div>
          <div className="h-[45%] glass-panel border border-white/10 rounded-2xl p-5 overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="w-4 h-4" />
                <h3 className="font-semibold text-sm uppercase tracking-wider">Asset Lab</h3>
              </div>
            </div>
            <GenerationGallery />
            {useCanvasStore.getState().generatedImages.length === 0 && (
              <div className="h-32 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 text-muted-foreground opacity-50 mt-4">
                <Layout className="w-6 h-6" />
                <span className="text-[10px] font-medium uppercase tracking-widest">No assets yet</span>
              </div>
            )}
          </div>
        </motion.aside>
      </div>
    </div>
  );
};

export default App;
