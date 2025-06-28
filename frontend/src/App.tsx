import React, { useEffect, useRef, useState } from 'react';
import { DesignEngine } from './engine/DesignEngine';
import './App.css';

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<DesignEngine | null>(null);
  const [isEngineLoaded, setIsEngineLoaded] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const initEngine = async () => {
      try {
        const engine = new DesignEngine();
        await engine.initialize();
        engineRef.current = engine;
        setIsEngineLoaded(true);
        
        if (canvasRef.current) {
          engine.setCanvas(canvasRef.current);
          engine.resize(canvasSize.width, canvasSize.height);
        }
      } catch (error) {
        console.error('Failed to initialize design engine:', error);
      }
    };

    initEngine();

    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (engineRef.current && canvasRef.current) {
      engineRef.current.resize(canvasSize.width, canvasSize.height);
    }
  }, [canvasSize]);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!engineRef.current) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      engineRef.current.onMouseDown(x, y);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!engineRef.current) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      engineRef.current.onMouseMove(x, y);
    }
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!engineRef.current) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      engineRef.current.onMouseUp(x, y);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Design Studio</h1>
        <div className="status">
          Engine: {isEngineLoaded ? 'Loaded' : 'Loading...'}
        </div>
      </header>
      
      <main className="app-main">
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{
              border: '1px solid #ccc',
              display: 'block'
            }}
          />
        </div>
        
        <div className="controls">
          <div className="control-group">
            <label>Canvas Size:</label>
            <input
              type="number"
              value={canvasSize.width}
              onChange={(e) => setCanvasSize(prev => ({ ...prev, width: parseInt(e.target.value) }))}
              min="100"
              max="2000"
            />
            <span>×</span>
            <input
              type="number"
              value={canvasSize.height}
              onChange={(e) => setCanvasSize(prev => ({ ...prev, height: parseInt(e.target.value) }))}
              min="100"
              max="2000"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;