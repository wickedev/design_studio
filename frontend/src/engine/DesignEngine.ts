// Import the WASM module factory
declare function DesignStudioModule(options?: any): Promise<any>;

declare global {
  interface Window {
    DesignStudioModule: typeof DesignStudioModule;
  }
}

export class DesignEngine {
  private wasmModule: any = null;
  private enginePtr: any = null;
  private canvas: HTMLCanvasElement | null = null;
  private gl: WebGLRenderingContext | null = null;

  async initialize(): Promise<void> {
    try {
      // Load the actual WASM module
      if (!this.wasmModule) {
        // Load the WASM module script if not already loaded
        if (typeof window.DesignStudioModule === 'undefined') {
          await this.loadWasmScript();
        }
        
        // Initialize the WASM module
        this.wasmModule = await window.DesignStudioModule();
        console.log('WASM module loaded successfully');
      }

      // Create engine instance
      this.enginePtr = this.wasmModule._engine_create();
      console.log('Design Engine C++ instance created');
      
    } catch (error) {
      console.error('Failed to initialize WASM module:', error);
      throw error;
    }
  }

  private async loadWasmScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '/DesignStudioModule.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load WASM script'));
      document.head.appendChild(script);
    });
  }

  setCanvas(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    
    if (!this.gl) {
      throw new Error('WebGL not supported');
    }

    // Initialize WebGL context
    this.gl.clearColor(0.95, 0.95, 0.95, 1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    
    console.log('WebGL context initialized');
  }

  resize(width: number, height: number): void {
    if (this.canvas) {
      this.canvas.width = width;
      this.canvas.height = height;
      
      if (this.gl) {
        this.gl.viewport(0, 0, width, height);
      }
    }

    if (this.wasmModule && this.enginePtr) {
      this.wasmModule._engine_set_canvas_size(this.enginePtr, width, height);
      this.wasmModule._engine_initialize(this.enginePtr, width, height);
    }

    this.render();
  }

  render(): void {
    if (!this.gl) return;

    // Clear the canvas
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Call WASM render function
    if (this.wasmModule && this.enginePtr) {
      this.wasmModule._engine_render(this.enginePtr);
    }
  }

  onMouseDown(x: number, y: number): void {
    if (this.wasmModule && this.enginePtr) {
      this.wasmModule._engine_mouse_down(this.enginePtr, x, y);
    }
    console.log(`Mouse down: ${x}, ${y}`);
  }

  onMouseMove(x: number, y: number): void {
    if (this.wasmModule && this.enginePtr) {
      this.wasmModule._engine_mouse_move(this.enginePtr, x, y);
    }
  }

  onMouseUp(x: number, y: number): void {
    if (this.wasmModule && this.enginePtr) {
      this.wasmModule._engine_mouse_up(this.enginePtr, x, y);
    }
    console.log(`Mouse up: ${x}, ${y}`);
  }

  // Rectangle drawing functions
  addRectangle(x: number, y: number, width: number, height: number): number {
    if (this.wasmModule && this.enginePtr) {
      const index = this.wasmModule._engine_add_rectangle(this.enginePtr, x, y, width, height);
      console.log(`Added rectangle ${index} at (${x}, ${y}) size ${width}x${height}`);
      this.render(); // Re-render after adding rectangle
      return index;
    }
    return -1;
  }

  setRectangleColor(index: number, r: number, g: number, b: number, a: number = 1.0): void {
    if (this.wasmModule && this.enginePtr) {
      this.wasmModule._engine_set_rectangle_color(this.enginePtr, index, r, g, b, a);
      console.log(`Set rectangle ${index} color to (${r}, ${g}, ${b}, ${a})`);
      this.render(); // Re-render after color change
    }
  }

  clearShapes(): void {
    if (this.wasmModule && this.enginePtr) {
      this.wasmModule._engine_clear_shapes(this.enginePtr);
      console.log('Cleared all shapes');
      this.render(); // Re-render after clearing
    }
  }

  destroy(): void {
    if (this.wasmModule && this.enginePtr) {
      this.wasmModule._engine_destroy(this.enginePtr);
      this.enginePtr = null;
    }
  }
}