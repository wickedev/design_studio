declare global {
  interface Window {
    Module: any;
  }
}

export class DesignEngine {
  private wasmModule: any = null;
  private enginePtr: any = null;
  private canvas: HTMLCanvasElement | null = null;
  private gl: WebGLRenderingContext | null = null;

  async initialize(): Promise<void> {
    // Load WASM module
    if (typeof window.Module === 'undefined') {
      // For now, we'll simulate the WASM module
      // In production, this would load the actual compiled WASM
      window.Module = {
        _engine_create: () => ({ ptr: 12345 }),
        _engine_destroy: (ptr: any) => {},
        _engine_initialize: (ptr: any, width: number, height: number) => true,
        _engine_render: (ptr: any) => {},
        _engine_set_canvas_size: (ptr: any, width: number, height: number) => {},
        _engine_mouse_down: (ptr: any, x: number, y: number) => {},
        _engine_mouse_move: (ptr: any, x: number, y: number) => {},
        _engine_mouse_up: (ptr: any, x: number, y: number) => {},
      };
    }

    this.wasmModule = window.Module;
    this.enginePtr = this.wasmModule._engine_create();
    
    console.log('Design Engine WASM module loaded');
  }

  setCanvas(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
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

    // For now, draw a simple test pattern
    this.drawTestPattern();
  }

  private drawTestPattern(): void {
    if (!this.gl || !this.canvas) return;

    // Simple test pattern using WebGL
    const vertices = new Float32Array([
      -0.5, -0.5,
       0.5, -0.5,
       0.0,  0.5
    ]);

    const vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

    // Basic vertex shader
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Basic fragment shader
    const fragmentShaderSource = `
      precision mediump float;
      void main() {
        gl_FragColor = vec4(0.2, 0.4, 0.8, 1.0);
      }
    `;

    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (vertexShader && fragmentShader) {
      const program = this.gl.createProgram();
      if (program) {
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        this.gl.useProgram(program);

        const positionLocation = this.gl.getAttribLocation(program, 'a_position');
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);

        this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
      }
    }
  }

  private createShader(type: number, source: string): WebGLShader | null {
    if (!this.gl) return null;

    const shader = this.gl.createShader(type);
    if (!shader) return null;

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
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

  destroy(): void {
    if (this.wasmModule && this.enginePtr) {
      this.wasmModule._engine_destroy(this.enginePtr);
      this.enginePtr = null;
    }
  }
}