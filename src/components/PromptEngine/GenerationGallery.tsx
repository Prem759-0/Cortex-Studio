import React from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Maximize2 } from 'lucide-react';

export const GenerationGallery: React.FC = () => {
  const { generatedImages } = useCanvasStore();

  if (generatedImages.length === 0) return null;

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Generated Assets</h3>
        <span className="text-xs font-mono bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">
          {generatedImages.length} items
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <AnimatePresence initial={false}>
          {generatedImages.map((url, index) => (
            <motion.div
              key={url + index}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                delay: index * 0.1 
              }}
              className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-muted"
            >
              <img 
                src={url} 
                alt="AI Generated" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay Controls */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                <button className="p-2 rounded-full bg-primary text-white hover:scale-110 transition-transform shadow-lg">
                  <Plus className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-full bg-white/20 text-white backdrop-blur-md hover:scale-110 transition-transform">
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
