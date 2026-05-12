======= FILE: src/components/PromptEngine/PromptBar.tsx =======
import React, { useState } from 'react';
import { Wand2, Sparkles, Loader2 } from 'lucide-react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { motion, AnimatePresence } from 'framer-motion';

export const PromptBar: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const { isGenerating, setGenerating, addGeneratedImage } = useCanvasStore();

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    
    setGenerating(true);
    
    // Simulate AI generation delay with processing animations
    setTimeout(() => {
      // Mock generation using picsum for visual fidelity
      const randomSeed = Math.floor(Math.random() * 1000);
      addGeneratedImage(`https://picsum.photos/seed/${randomSeed}/800/800`);
      setGenerating(false);
      setPrompt('');
    }, 3500);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto z-50">
      <div className={`relative flex items-center bg-card/80 backdrop-blur-2xl border transition-all duration-500 rounded-2xl shadow-2xl p-1.5 ${
        isGenerating ? 'border-primary shadow-primary/20' : 'border-white/10 hover:border-primary/50'
      }`}>
        
        {/* Animated Glow on typing */}
        <AnimatePresence>
          {prompt.length > 0 && !isGenerating && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-3xl blur-md -z-10 opacity-30"
            />
          )}
        </AnimatePresence>

        <div className="pl-4 pr-2 text-primary">
          {isGenerating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
        </div>
        
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want to create... (e.g., 'Cyberpunk cityscape')"
          disabled={isGenerating}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          className="flex-1 bg-transparent border-none outline-none px-2 py-3 text-foreground placeholder:text-muted-foreground disabled:opacity-50 font-medium"
        />
        
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="bg-primary text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:hover:bg-primary active:scale-95 shadow-md"
        >
          {isGenerating ? 'Generating...' : 'Generate'}
          {!isGenerating && <Wand2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
