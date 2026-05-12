import React, { useState } from 'react';
import { Wand2, Sparkles, Loader2, Image as ImageIcon } from 'lucide-react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { motion, AnimatePresence } from 'framer-motion';

const STYLES = ['Cinematic', 'Anime', 'Cyberpunk', 'Watercolor'];
const RATIOS = ['1:1', '16:9', '9:16'];

export const PromptBar: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const { isGenerating, setGenerating, addGeneratedImage, aiStyle, setAiStyle, aiAspectRatio, setAiAspectRatio } = useCanvasStore();

  const handleGenerate = () => {
    if (!prompt.trim() || isGenerating) return;
    setGenerating(true);
    setTimeout(() => {
      const randomSeed = Math.floor(Math.random() * 1000);
      const dimensions = aiAspectRatio === '16:9' ? '800/450' : aiAspectRatio === '9:16' ? '450/800' : '800/800';
      addGeneratedImage(`https://picsum.photos/seed/${randomSeed}/${dimensions}`);
      setGenerating(false);
      setPrompt('');
      setIsConfigOpen(false);
    }, 3500);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto z-50 flex flex-col gap-2">
      <div className={`relative flex items-center bg-card/80 backdrop-blur-2xl border transition-all duration-500 rounded-2xl shadow-2xl p-1.5 ${
        isGenerating ? 'border-primary shadow-primary/20' : 'border-white/10 hover:border-primary/50'
      }`}>
        <AnimatePresence>
          {prompt.length > 0 && !isGenerating && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-3xl blur-md -z-10 opacity-30" />
          )}
        </AnimatePresence>

        <button onClick={() => setIsConfigOpen(!isConfigOpen)} className="p-3 text-muted-foreground hover:text-primary transition-colors rounded-xl hover:bg-primary/10">
          <ImageIcon className="w-5 h-5" />
        </button>
        
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={`Generate a ${aiStyle} masterpiece...`}
          disabled={isGenerating}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          className="flex-1 bg-transparent border-none outline-none px-2 py-3 text-foreground placeholder:text-muted-foreground disabled:opacity-50 font-medium"
        />
        
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="bg-primary text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:hover:bg-primary active:scale-95 shadow-md"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
          Generate
        </button>
      </div>

      <AnimatePresence>
        {isConfigOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 p-4 bg-card/90 backdrop-blur-xl border border-border rounded-2xl shadow-xl flex gap-6"
          >
            <div>
              <span className="text-xs font-bold uppercase text-muted-foreground mb-2 block">Style Engine</span>
              <div className="flex gap-2">
                {STYLES.map(s => (
                  <button key={s} onClick={() => setAiStyle(s)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${aiStyle === s ? 'bg-primary text-white shadow-md' : 'bg-secondary hover:bg-secondary/80'}`}>{s}</button>
                ))}
              </div>
            </div>
            <div className="w-px bg-border"></div>
            <div>
              <span className="text-xs font-bold uppercase text-muted-foreground mb-2 block">Aspect Ratio</span>
              <div className="flex gap-2">
                {RATIOS.map(r => (
                  <button key={r} onClick={() => setAiAspectRatio(r)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${aiAspectRatio === r ? 'bg-accent text-white shadow-md' : 'bg-secondary hover:bg-secondary/80'}`}>{r}</button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
