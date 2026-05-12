======= FILE: src/store/useCanvasStore.ts =======
import { create } from 'zustand';

export type Point = { x: number; y: number };

export type Stroke = {
  id: string;
  tool: 'brush' | 'eraser';
  points: Point[];
  color: string;
  size: number;
};

export type Layer = {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  strokes: Stroke[];
};

interface CanvasState {
  layers: Layer[];
  activeLayerId: string;
  activeTool: 'brush' | 'eraser' | 'move';
  brushColor: string;
  brushSize: number;
  isGenerating: boolean;
  generatedImages: string[];
  
  // Actions
  setTool: (tool: 'brush' | 'eraser' | 'move') => void;
  setBrushColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  addLayer: () => void;
  removeLayer: (id: string) => void;
  setActiveLayer: (id: string) => void;
  toggleLayerVisibility: (id: string) => void;
  setLayerOpacity: (id: string, opacity: number) => void;
  addStrokeToActiveLayer: (stroke: Stroke) => void;
  setGenerating: (status: boolean) => void;
  addGeneratedImage: (url: string) => void;
}

const initialLayerId = crypto.randomUUID();

export const useCanvasStore = create<CanvasState>((set) => ({
  layers: [{ id: initialLayerId, name: 'Background', visible: true, opacity: 100, strokes: [] }],
  activeLayerId: initialLayerId,
  activeTool: 'brush',
  brushColor: '#818cf8', // Primary brand color
  brushSize: 5,
  isGenerating: false,
  generatedImages: [],

  setTool: (tool) => set({ activeTool: tool }),
  setBrushColor: (color) => set({ brushColor: color }),
  setBrushSize: (size) => set({ brushSize: size }),
  
  addLayer: () => set((state) => {
    const newLayerId = crypto.randomUUID();
    return {
      layers: [{ id: newLayerId, name: `Layer ${state.layers.length + 1}`, visible: true, opacity: 100, strokes: [] }, ...state.layers],
      activeLayerId: newLayerId
    };
  }),
  
  removeLayer: (id) => set((state) => ({
    layers: state.layers.filter(l => l.id !== id),
    activeLayerId: state.activeLayerId === id && state.layers.length > 1 
      ? state.layers.find(l => l.id !== id)?.id || state.layers[0].id 
      : state.activeLayerId
  })),

  setActiveLayer: (id) => set({ activeLayerId: id }),
  
  toggleLayerVisibility: (id) => set((state) => ({
    layers: state.layers.map(l => l.id === id ? { ...l, visible: !l.visible } : l)
  })),

  setLayerOpacity: (id, opacity) => set((state) => ({
    layers: state.layers.map(l => l.id === id ? { ...l, opacity } : l)
  })),

  addStrokeToActiveLayer: (stroke) => set((state) => ({
    layers: state.layers.map(l => l.id === state.activeLayerId ? { ...l, strokes: [...l.strokes, stroke] } : l)
  })),

  setGenerating: (status) => set({ isGenerating: status }),
  addGeneratedImage: (url) => set((state) => ({ generatedImages: [url, ...state.generatedImages] }))
}));
