import React from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { Eye, EyeOff, Plus, Trash2, Layers, GripVertical } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

export const LayersPanel: React.FC = () => {
  const { layers, activeLayerId, setActiveLayer, addLayer, removeLayer, toggleLayerVisibility, setLayerOpacity, reorderLayers } = useCanvasStore();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
          <Layers className="w-4 h-4" />
          Layers
        </h3>
        <button 
          onClick={addLayer}
          className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        <Reorder.Group axis="y" values={layers} onReorder={reorderLayers} className="space-y-2">
          <AnimatePresence initial={false}>
            {layers.map((layer) => (
              <Reorder.Item
                key={layer.id}
                value={layer}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => setActiveLayer(layer.id)}
                className={`p-3 rounded-xl border transition-colors flex flex-col gap-2 ${
                  activeLayerId === layer.id 
                    ? 'bg-primary/5 border-primary/30 shadow-sm' 
                    : 'bg-card border-border hover:border-border/80 cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-muted-foreground/50 cursor-grab active:cursor-grabbing hover:text-foreground transition-colors" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleLayerVisibility(layer.id); }}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 opacity-50" />}
                    </button>
                    <span className={`text-sm font-medium ${!layer.visible && 'opacity-50 line-through'}`}>
                      {layer.name}
                    </span>
                  </div>
                  {layers.length > 1 && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeLayer(layer.id); }}
                      className="text-red-500/70 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                {activeLayerId === layer.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="flex items-center gap-2 pt-1 overflow-hidden"
                  >
                    <span className="text-[10px] font-mono text-muted-foreground w-6">{layer.opacity}%</span>
                    <input 
                      type="range" min="0" max="100" 
                      value={layer.opacity}
                      onPointerDown={(e) => e.stopPropagation()} // Prevent drag conflict
                      onChange={(e) => setLayerOpacity(layer.id, parseInt(e.target.value))}
                      className="flex-1 h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </motion.div>
                )}
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
      </div>
    </div>
  );
};
