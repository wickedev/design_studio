#!/bin/bash

# Build script for WebAssembly using Emscripten
set -e

echo "Building Design Studio WASM module..."

# Check if Emscripten is installed
if ! command -v emcc &> /dev/null; then
    echo "Error: Emscripten not found. Please install Emscripten SDK."
    echo "Visit: https://emscripten.org/docs/getting_started/downloads.html"
    exit 1
fi

# Create build directory
cd core
mkdir -p build

# Configure with Emscripten
echo "Configuring CMake with Emscripten..."
emcmake cmake -B build -DCMAKE_BUILD_TYPE=Release

# Build the project
echo "Building WASM module..."
emmake make -C build

echo "WASM build complete!"
echo "Generated files should be in frontend/public/"

# List generated files
if [ -d "../frontend/public" ]; then
    echo "Generated WASM files:"
    ls -la ../frontend/public/*.wasm ../frontend/public/*.js 2>/dev/null || echo "No WASM files found"
fi