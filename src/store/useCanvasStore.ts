import { create } from 'zustand';

export type Point = { x: number; y: number };
export type ToolType = 'brush' | 'eraser' | 'move' | 'rect' | 'circle' | 'highlighter' | 'neon' | 'pan';

export type Stroke = {
  id: string;
  tool: ToolType;
  points: Point[];
  color: string;
  size: number;
};

export type LayerFilters = {
  brightness: number;
  contrast: number;
  blur: number;
};

export type Layer = {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  filters: LayerFilters;
  strokes: Stroke[];
};

interface CanvasState {
  layers: Layer[];
  activeLayerId: string;
  activeTool: ToolType;
  brushColor: string;
  brushSize: number;
  zoom: number;
  pan: { x: number; y: number };
  showGrid: boolean;
  isGenerating: boolean;
  generatedImages: string[];
  aiStyle: string;
  aiAspectRatio: string;
  history: Layer[][];
  historyIndex: number;

  saveHistory: () => void;
  undo: () => void;
  redo: () => void;
  setTool: (tool: ToolType) => void;
  setBrushColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  setZoom: (zoom: number | ((z: number) => number)) => void;
  setPan: (pan: { x: number; y: number } | ((p: { x: number; y: number }) => { x: number; y: number })) => void;
  setShowGrid: (show: boolean) => void;
  setAiStyle: (style: string) => void;
  setAiAspectRatio: (ratio: string) => void;
  
  addLayer: () => void;
  removeLayer: (id: string) => void;
  setActiveLayer: (id: string) => void;
  toggleLayerVisibility: (id: string) => void;
  setLayerOpacity: (id: string, opacity: number) => void;
  setLayerFilter: (id: string, filterType: keyof LayerFilters, value: number) => void;
  reorderLayers: (newOrder: Layer[]) => void;
  addStrokeToActiveLayer: (stroke: Stroke) => void;
  setGenerating: (status: boolean) => void;
  addGeneratedImage: (url: string) => void;
  
  clearCanvas: () => void;
  loadProject: (projectData: any) => void;
}

const initialLayerId = crypto.randomUUID();
const defaultFilters: LayerFilters = { brightness: 100, contrast: 100, blur: 0 };
const initialLayers = [{ id: initialLayerId, name: 'Background', visible: true, opacity: 100, filters: defaultFilters, strokes: [] }];

export const useCanvasStore = create<CanvasState>((set, get) => ({
  layers: initialLayers,
  activeLayerId: initialLayerId,
  activeTool: 'brush',
  brushColor: '#818cf8',
  brushSize: 5,
  zoom: 1,
  pan: { x: 0, y: 0 },
  showGrid: true,
  isGenerating: false,
  generatedImages: [],
  aiStyle: 'Cinematic',
  aiAspectRatio: '1:1',
  history: [initialLayers],
  historyIndex: 0,

  saveHistory: () => set((state) => {
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(state.layers))); 
    if (newHistory.length > 30) newHistory.shift(); 
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
  setZoom: (zoom) => set((state) => ({ zoom: typeof zoom === 'function' ? zoom(state.zoom) : zoom })),
  setPan: (pan) => set((state) => ({ pan: typeof pan === 'function' ? pan(state.pan) : pan })),
  setShowGrid: (show) => set({ showGrid: show }),
  setAiStyle: (style) => set({ aiStyle: style }),
  setAiAspectRatio: (ratio) => set({ aiAspectRatio: ratio }),
  
  addLayer: () => {
    set((state) => {
      const newLayerId = crypto.randomUUID();
      return {
        layers: [{ id: newLayerId, name: `Layer ${state.layers.length + 1}`, visible: true, opacity: 100, filters: { ...defaultFilters }, strokes: [] }, ...state.layers],
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
    set((state) => ({ layers: state.layers.map(l => l.id === id ? { ...l, visible: !l.visible } : l) }));
    get().saveHistory();
  },

  setLayerOpacity: (id, opacity) => set((state) => ({
    layers: state.layers.map(l => l.id === id ? { ...l, opacity } : l)
  })),

  setLayerFilter: (id, filterType, value) => {
    set((state) => ({
      layers: state.layers.map(l => l.id === id ? { ...l, filters: { ...l.filters, [filterType]: value } } : l)
    }));
  },

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
  addGeneratedImage: (url) => set((state) => ({ generatedImages: [url, ...state.generatedImages] })),

  clearCanvas: () => {
    const newLayerId = crypto.randomUUID();
    const newLayers = [{ id: newLayerId, name: 'Background', visible: true, opacity: 100, filters: { ...defaultFilters }, strokes: [] }];
    set({ layers: newLayers, activeLayerId: newLayerId, history: [newLayers], historyIndex: 0, pan: {x:0, y:0}, zoom: 1 });
  },

  loadProject: (projectData) => {
    try {
      if (projectData && projectData.layers && Array.isArray(projectData.layers)) {
        set({ 
          layers: projectData.layers, 
          activeLayerId: projectData.layers[0]?.id || crypto.randomUUID(),
          history: [projectData.layers],
          historyIndex: 0,
          zoom: 1,
          pan: { x: 0, y: 0 }
        });
      }
    } catch (e) {
      console.error("Failed to load project", e);
    }
  }
}));
