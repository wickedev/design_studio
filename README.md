# Design Studio

A high-performance design editor for web and desktop platforms, similar to Figma.

## Technology Stack

### Frontend
- **TypeScript/React** - Modern UI framework
- **WebGL** - Hardware-accelerated rendering
- **WebAssembly** - High-performance core engine

### Build System
- **Emscripten** - C++ to WebAssembly compilation
- **CMake** - Cross-platform build management
- **Yarn** - Package management and build scripts

### Cross-Platform Deployment
- **Web** - Progressive Web App with WASM
- **Desktop** - Electron or Tauri wrapper

## Architecture

```
Frontend (TypeScript/React)
    ↕ (WebAssembly bindings)
Core Engine (C++)
```
