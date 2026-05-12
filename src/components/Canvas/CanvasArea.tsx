import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useCanvasStore, Point, Stroke } from '../../store/useCanvasStore';
import { motion } from 'framer-motion';

export const CanvasArea: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  
  const { layers, activeLayerId, activeTool, brushColor, brushSize, addStrokeToActiveLayer } = useCanvasStore();

  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>): Point | null => {
    if (!canvasRef.current) return null;
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (activeTool === 'move') return;
    
    e.currentTarget.setPointerCapture(e.pointerId);
    const coords = getCoordinates(e);
    if (!coords) return;
    
    setIsDrawing(true);
    setCurrentStroke({
      id: crypto.randomUUID(),
      tool: activeTool,
      color: activeTool === 'eraser' ? '#000000' : brushColor,
      size: brushSize,
      points: [coords]
    });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentStroke) return;
    const coords = getCoordinates(e);
    if (!coords) return;

    setCurrentStroke(prev => {
      if (!prev) return prev;
      // For shapes, we only need the start point and current point
      if (prev.tool === 'rect' || prev.tool === 'circle') {
        return { ...prev, points: [prev.points[0], coords] };
      }
      // For brush, keep adding points
      return { ...prev, points: [...prev.points, coords] };
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDrawing(false);
    if (currentStroke && currentStroke.points.length > 1) {
      addStrokeToActiveLayer(currentStroke);
    }
    setCurrentStroke(null);
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

      const strokesToRender = layer.id === activeLayerId && currentStroke 
        ? [...layer.strokes, currentStroke] 
        : layer.strokes;

      strokesToRender.forEach(stroke => {
        if (stroke.points.length < 2) return;
        
        offCtx.beginPath();
        offCtx.lineCap = 'round';
        offCtx.lineJoin = 'round';
        offCtx.lineWidth = stroke.size;

        if (stroke.tool === 'eraser') {
          offCtx.globalCompositeOperation = 'destination-out';
          offCtx.strokeStyle = 'rgba(0,0,0,1)';
        } else {
          offCtx.globalCompositeOperation = 'source-over';
          offCtx.strokeStyle = stroke.color;
        }

        const start = stroke.points[0];
        const end = stroke.points[stroke.points.length - 1];

        if (stroke.tool === 'brush' || stroke.tool === 'eraser') {
          offCtx.moveTo(start.x, start.y);
          for (let i = 1; i < stroke.points.length; i++) {
            offCtx.lineTo(stroke.points[i].x, stroke.points[i].y);
          }
          offCtx.stroke();
        } 
        else if (stroke.tool === 'rect') {
          const width = end.x - start.x;
          const height = end.y - start.y;
          offCtx.strokeRect(start.x, start.y, width, height);
        }
        else if (stroke.tool === 'circle') {
          const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
          offCtx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
          offCtx.stroke();
        }
      });

      ctx.globalAlpha = layer.opacity / 100;
      ctx.drawImage(offCanvas, 0, 0);
      ctx.globalAlpha = 1.0;
    });
  }, [layers, currentStroke, activeLayerId]);

  useEffect(() => {
    const resizeCanvas = () => {
      if (containerRef.current && canvasRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = containerRef.current.clientHeight;
        renderCanvas();
      }
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  useEffect(() => {
    requestAnimationFrame(renderCanvas);
  }, [renderCanvas]);

  return (
    <div ref={containerRef} className={`w-full h-full relative rounded-xl overflow-hidden shadow-inner bg-white dark:bg-zinc-900/50 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNlMmU4ZjAiLz48L3N2Zz4=')] ${activeTool === 'move' ? 'cursor-grab' : 'cursor-crosshair'}`}>
      <motion.canvas
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        ref={canvasRef}
        className="absolute inset-0 w-full h-full touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
    </div>
  );
};
