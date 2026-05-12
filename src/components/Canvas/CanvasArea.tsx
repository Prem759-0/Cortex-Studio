import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useCanvasStore, Point, Stroke } from '../../store/useCanvasStore';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut } from 'lucide-react';

export const CanvasArea: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState<Point | null>(null);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  
  const { 
    layers, activeLayerId, activeTool, brushColor, brushSize, 
    zoom, setZoom, pan, setPan, addStrokeToActiveLayer 
  } = useCanvasStore();

  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>): Point | null => {
    if (!canvasRef.current) return null;
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: (e.clientX - rect.left) / zoom, y: (e.clientY - rect.top) / zoom };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (activeTool === 'move') return;
    if (activeTool === 'pan' || e.button === 1 || e.altKey) {
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }
    
    e.currentTarget.setPointerCapture(e.pointerId);
    const coords = getCoordinates(e);
    if (!coords) return;
    
    setIsDrawing(true);
    setCurrentStroke({
      id: crypto.randomUUID(), tool: activeTool, color: activeTool === 'eraser' ? '#000000' : brushColor,
      size: brushSize, points: [coords]
    });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isPanning && lastPanPoint) {
      const dx = e.clientX - lastPanPoint.x;
      const dy = e.clientY - lastPanPoint.y;
      setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }

    if (!isDrawing || !currentStroke) return;
    const coords = getCoordinates(e);
    if (!coords) return;

    setCurrentStroke(prev => {
      if (!prev) return prev;
      if (prev.tool === 'rect' || prev.tool === 'circle') return { ...prev, points: [prev.points[0], coords] };
      return { ...prev, points: [...prev.points, coords] };
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    if (isPanning) { setIsPanning(false); setLastPanPoint(null); return; }
    setIsDrawing(false);
    if (currentStroke && currentStroke.points.length > 1) addStrokeToActiveLayer(currentStroke);
    setCurrentStroke(null);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom(prev => Math.min(Math.max(0.1, prev + delta), 5));
    }
  };

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    [...layers].reverse().forEach(layer => {
      if (!layer.visible) return;

      const offCanvas = document.createElement('canvas');
      offCanvas.width = canvas.width;
      offCanvas.height = canvas.height;
      const offCtx = offCanvas.getContext('2d');
      if (!offCtx) return;

      const strokesToRender = layer.id === activeLayerId && currentStroke ? [...layer.strokes, currentStroke] : layer.strokes;

      strokesToRender.forEach(stroke => {
        if (stroke.points.length < 2) return;
        
        offCtx.beginPath(); offCtx.lineCap = 'round'; offCtx.lineJoin = 'round'; offCtx.lineWidth = stroke.size;

        if (stroke.tool === 'eraser') {
          offCtx.globalCompositeOperation = 'destination-out'; offCtx.strokeStyle = 'rgba(0,0,0,1)';
        } else if (stroke.tool === 'highlighter') {
          offCtx.globalCompositeOperation = 'multiply'; offCtx.strokeStyle = stroke.color + '80'; 
        } else if (stroke.tool === 'neon') {
          offCtx.globalCompositeOperation = 'screen'; offCtx.strokeStyle = stroke.color;
          offCtx.shadowColor = stroke.color; offCtx.shadowBlur = 15;
        } else {
          offCtx.globalCompositeOperation = 'source-over'; offCtx.strokeStyle = stroke.color; offCtx.shadowBlur = 0;
        }

        const start = stroke.points[0]; const end = stroke.points[stroke.points.length - 1];

        if (['brush', 'eraser', 'highlighter', 'neon'].includes(stroke.tool)) {
          offCtx.moveTo(start.x, start.y);
          for (let i = 1; i < stroke.points.length; i++) offCtx.lineTo(stroke.points[i].x, stroke.points[i].y);
          offCtx.stroke();
        } else if (stroke.tool === 'rect') {
          offCtx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
        } else if (stroke.tool === 'circle') {
          const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
          offCtx.arc(start.x, start.y, radius, 0, 2 * Math.PI); offCtx.stroke();
        }
      });

      // APPLY PROFESSIONAL CSS FILTERS
      ctx.globalAlpha = layer.opacity / 100;
      ctx.filter = `brightness(${layer.filters.brightness}%) contrast(${layer.filters.contrast}%) blur(${layer.filters.blur}px)`;
      ctx.drawImage(offCanvas, 0, 0);
      ctx.filter = 'none'; // Reset
      ctx.globalAlpha = 1.0;
    });
  }, [layers, currentStroke, activeLayerId]);

  useEffect(() => {
    const resizeCanvas = () => {
      if (containerRef.current && canvasRef.current) {
        if (canvasRef.current.width === 0) { canvasRef.current.width = 1920; canvasRef.current.height = 1080; }
        renderCanvas();
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  useEffect(() => { requestAnimationFrame(renderCanvas); }, [renderCanvas]);

  return (
    <div ref={containerRef} onWheel={handleWheel} className="w-full h-full relative overflow-hidden bg-zinc-100 dark:bg-zinc-950/80 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNlMmU4ZjAiLz48L3N2Zz4=')]">
      <div style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0', transition: isPanning ? 'none' : 'transform 0.1s ease-out' }} className={`absolute top-1/2 left-1/2 -mt-[540px] -ml-[960px] w-[1920px] h-[1080px] bg-white shadow-2xl transition-transform ${activeTool === 'pan' || isPanning ? 'cursor-grab active:cursor-grabbing' : 'cursor-crosshair'}`}>
        <motion.canvas initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} ref={canvasRef} id="cortex-main-canvas" className="absolute inset-0 w-full h-full touch-none" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp} onContextMenu={(e) => e.preventDefault()} />
      </div>
      <div className="absolute bottom-6 right-6 flex items-center bg-background/80 backdrop-blur-md rounded-xl shadow-lg border border-border p-1 z-50">
        <button onClick={() => setZoom(z => Math.max(0.1, z - 0.1))} className="p-2 hover:bg-secondary rounded-lg"><ZoomOut className="w-4 h-4" /></button>
        <button onClick={() => { setZoom(1); setPan({x: 0, y: 0}); }} className="px-3 text-xs font-mono font-bold hover:bg-secondary rounded-lg">{(zoom * 100).toFixed(0)}%</button>
        <button onClick={() => setZoom(z => Math.min(5, z + 0.1))} className="p-2 hover:bg-secondary rounded-lg"><ZoomIn className="w-4 h-4" /></button>
      </div>
    </div>
  );
};
