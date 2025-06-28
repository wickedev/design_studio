import React, { useEffect, useRef, useState } from 'react';
import { DesignEngine } from './engine/DesignEngine';
import './App.css';

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<DesignEngine | null>(null);
  const [isEngineLoaded, setIsEngineLoaded] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [drawMode, setDrawMode] = useState(false);

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
      
      if (drawMode) {
        // Add a rectangle at click position
        const size = 50 + Math.random() * 50;
        const index = engineRef.current.addRectangle(x - size/2, y - size/2, size, size);
        // Set random color
        const r = Math.random();
        const g = Math.random();
        const b = Math.random();
        engineRef.current.setRectangleColor(index, r, g, b, 1.0);
      } else {
        engineRef.current.onMouseDown(x, y);
      }
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

  const addRandomRectangle = () => {
    if (!engineRef.current) return;
    
    const x = Math.random() * (canvasSize.width - 100);
    const y = Math.random() * (canvasSize.height - 100);
    const width = 50 + Math.random() * 100;
    const height = 50 + Math.random() * 100;
    
    engineRef.current.addRectangle(x, y, width, height);
  };

  const addColoredRectangle = () => {
    if (!engineRef.current) return;
    
    const x = Math.random() * (canvasSize.width - 100);
    const y = Math.random() * (canvasSize.height - 100);
    const width = 50 + Math.random() * 100;
    const height = 50 + Math.random() * 100;
    
    const index = engineRef.current.addRectangle(x, y, width, height);
    
    // Set random color
    const r = Math.random();
    const g = Math.random();
    const b = Math.random();
    engineRef.current.setRectangleColor(index, r, g, b, 1.0);
  };

  const clearAllShapes = () => {
    if (!engineRef.current) return;
    engineRef.current.clearShapes();
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
          
          <div className="control-group">
            <label>Rectangle Controls:</label>
            <button onClick={() => addRandomRectangle()}>Add Rectangle</button>
            <button onClick={() => addColoredRectangle()}>Add Colored Rectangle</button>
            <button onClick={() => clearAllShapes()}>Clear All</button>
            <label>
              <input 
                type="checkbox" 
                checked={drawMode} 
                onChange={(e) => setDrawMode(e.target.checked)} 
              />
              Click to Draw Mode
            </label>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;