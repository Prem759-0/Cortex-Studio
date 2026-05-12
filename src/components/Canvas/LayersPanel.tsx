import React from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { Eye, EyeOff, Plus, Trash2, Layers, GripVertical, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

export const LayersPanel: React.FC = () => {
  const { layers, activeLayerId, setActiveLayer, addLayer, removeLayer, toggleLayerVisibility, setLayerOpacity, setLayerFilter, reorderLayers, saveHistory } = useCanvasStore();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
          <Layers className="w-4 h-4" />
          Layers & Properties
        </h3>
        <button onClick={addLayer} className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors shadow-sm"><Plus className="w-4 h-4" /></button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        <Reorder.Group axis="y" values={layers} onReorder={reorderLayers} className="space-y-3">
          <AnimatePresence initial={false}>
            {layers.map((layer) => (
              <Reorder.Item
                key={layer.id} value={layer} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => setActiveLayer(layer.id)}
                className={`p-3 rounded-2xl border transition-colors flex flex-col gap-3 ${activeLayerId === layer.id ? 'bg-primary/5 border-primary/40 shadow-md' : 'bg-card border-border hover:border-border/80 cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-muted-foreground/50 cursor-grab active:cursor-grabbing hover:text-foreground transition-colors" />
                    <button onClick={(e) => { e.stopPropagation(); toggleLayerVisibility(layer.id); }} className="text-muted-foreground hover:text-foreground transition-colors">
                      {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 opacity-50" />}
                    </button>
                    <span className={`text-sm font-semibold tracking-tight ${!layer.visible && 'opacity-50 line-through'}`}>{layer.name}</span>
                  </div>
                  {layers.length > 1 && (
                    <button onClick={(e) => { e.stopPropagation(); removeLayer(layer.id); }} className="text-red-500/70 hover:text-red-500 transition-colors p-1"><Trash2 className="w-4 h-4" /></button>
                  )}
                </div>
                
                {activeLayerId === layer.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="flex flex-col gap-3 pt-2 border-t border-border/50 overflow-hidden">
                    
                    {/* Opacity */}
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground w-12">Opacity</span>
                      <input type="range" min="0" max="100" value={layer.opacity} onPointerDown={(e) => e.stopPropagation()} onChange={(e) => setLayerOpacity(layer.id, parseInt(e.target.value))} onMouseUp={saveHistory} onTouchEnd={saveHistory} className="flex-1 h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary" />
                      <span className="text-[10px] font-mono text-muted-foreground w-6 text-right">{layer.opacity}%</span>
                    </div>

                    {/* Brightness */}
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground w-12">Bright</span>
                      <input type="range" min="0" max="200" value={layer.filters.brightness} onPointerDown={(e) => e.stopPropagation()} onChange={(e) => setLayerFilter(layer.id, 'brightness', parseInt(e.target.value))} onMouseUp={saveHistory} onTouchEnd={saveHistory} className="flex-1 h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary" />
                    </div>

                    {/* Contrast */}
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground w-12">Contrast</span>
                      <input type="range" min="0" max="200" value={layer.filters.contrast} onPointerDown={(e) => e.stopPropagation()} onChange={(e) => setLayerFilter(layer.id, 'contrast', parseInt(e.target.value))} onMouseUp={saveHistory} onTouchEnd={saveHistory} className="flex-1 h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary" />
                    </div>

                    {/* Blur */}
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground w-12">Blur</span>
                      <input type="range" min="0" max="20" value={layer.filters.blur} onPointerDown={(e) => e.stopPropagation()} onChange={(e) => setLayerFilter(layer.id, 'blur', parseInt(e.target.value))} onMouseUp={saveHistory} onTouchEnd={saveHistory} className="flex-1 h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary" />
                    </div>

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
