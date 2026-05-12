import { create } from 'zustand';

export type Point = { x: number; y: number };
export type ToolType = 'brush' | 'eraser' | 'move' | 'rect' | 'circle';

export type Stroke = {
  id: string;
  tool: ToolType;
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
  activeTool: ToolType;
  brushColor: string;
  brushSize: number;
  isGenerating: boolean;
  generatedImages: string[];
  
  // History State
  history: Layer[][];
  historyIndex: number;

  // Actions
  saveHistory: () => void;
  undo: () => void;
  redo: () => void;
  setTool: (tool: ToolType) => void;
  setBrushColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  addLayer: () => void;
  removeLayer: (id: string) => void;
  setActiveLayer: (id: string) => void;
  toggleLayerVisibility: (id: string) => void;
  setLayerOpacity: (id: string, opacity: number) => void;
  reorderLayers: (newOrder: Layer[]) => void;
  addStrokeToActiveLayer: (stroke: Stroke) => void;
  setGenerating: (status: boolean) => void;
  addGeneratedImage: (url: string) => void;
}

const initialLayerId = crypto.randomUUID();
const initialLayers = [{ id: initialLayerId, name: 'Background', visible: true, opacity: 100, strokes: [] }];

export const useCanvasStore = create<CanvasState>((set, get) => ({
  layers: initialLayers,
  activeLayerId: initialLayerId,
  activeTool: 'brush',
  brushColor: '#818cf8',
  brushSize: 5,
  isGenerating: false,
  generatedImages: [],
  history: [initialLayers],
  historyIndex: 0,

  saveHistory: () => set((state) => {
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(state.layers))); // Deep copy
    // Keep max 20 history states to prevent memory leaks
    if (newHistory.length > 20) newHistory.shift(); 
    return { history: newHistory, historyIndex: newHistory.length - 1 };
  }),

  undo: () => set((state) => {
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1;
      return { layers: JSON.parse(JSON.stringify(state.history[newIndex])), historyIndex: newIndex };
    }
    return state;
  }),

  redo: () => set((state) => {
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1;
      return { layers: JSON.parse(JSON.stringify(state.history[newIndex])), historyIndex: newIndex };
    }
    return state;
  }),

  setTool: (tool) => set({ activeTool: tool }),
  setBrushColor: (color) => set({ brushColor: color }),
  setBrushSize: (size) => set({ brushSize: size }),
  
  addLayer: () => {
    set((state) => {
      const newLayerId = crypto.randomUUID();
      return {
        layers: [{ id: newLayerId, name: `Layer ${state.layers.length + 1}`, visible: true, opacity: 100, strokes: [] }, ...state.layers],
        activeLayerId: newLayerId
      };
    });
    get().saveHistory();
  },
  
  removeLayer: (id) => {
    set((state) => ({
      layers: state.layers.filter(l => l.id !== id),
      activeLayerId: state.activeLayerId === id && state.layers.length > 1 
        ? state.layers.find(l => l.id !== id)?.id || state.layers[0].id 
        : state.activeLayerId
    }));
    get().saveHistory();
  },

  setActiveLayer: (id) => set({ activeLayerId: id }),
  
  toggleLayerVisibility: (id) => {
    set((state) => ({
      layers: state.layers.map(l => l.id === id ? { ...l, visible: !l.visible } : l)
    }));
    get().saveHistory();
  },

  setLayerOpacity: (id, opacity) => set((state) => ({
    layers: state.layers.map(l => l.id === id ? { ...l, opacity } : l)
  })),

  reorderLayers: (newOrder) => {
    set({ layers: newOrder });
    get().saveHistory();
  },

  addStrokeToActiveLayer: (stroke) => {
    set((state) => ({
      layers: state.layers.map(l => l.id === state.activeLayerId ? { ...l, strokes: [...l.strokes, stroke] } : l)
    }));
    get().saveHistory();
  },

  setGenerating: (status) => set({ isGenerating: status }),
  addGeneratedImage: (url) => set((state) => ({ generatedImages: [url, ...state.generatedImages] }))
}));
