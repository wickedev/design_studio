#pragma once

#include <memory>
#include <vector>
#include <cstdint>

namespace studio {

struct Point {
    float x, y;
};

struct Size {
    float width, height;
};

struct Rect {
    float x, y, width, height;
};

class RenderContext {
public:
    virtual ~RenderContext() = default;
    virtual void clear() = 0;
    virtual void flush() = 0;
};

class Shape {
public:
    virtual ~Shape() = default;
    virtual void render(RenderContext* context) = 0;
    virtual Rect getBounds() const = 0;
};

class DesignEngine {
public:
    DesignEngine();
    ~DesignEngine();
    
    bool initialize(int width, int height);
    void resize(int width, int height);
    void render();
    
    void addShape(std::unique_ptr<Shape> shape);
    void removeShape(size_t index);
    void clearShapes();
    
    // WebAssembly interface
    void setCanvasSize(int width, int height);
    void onMouseDown(float x, float y);
    void onMouseMove(float x, float y);
    void onMouseUp(float x, float y);
    
private:
    class Impl;
    std::unique_ptr<Impl> pImpl;
};

// C interface for WebAssembly
extern "C" {
    DesignEngine* engine_create();
    void engine_destroy(DesignEngine* engine);
    bool engine_initialize(DesignEngine* engine, int width, int height);
    void engine_render(DesignEngine* engine);
    void engine_set_canvas_size(DesignEngine* engine, int width, int height);
    void engine_mouse_down(DesignEngine* engine, float x, float y);
    void engine_mouse_move(DesignEngine* engine, float x, float y);
    void engine_mouse_up(DesignEngine* engine, float x, float y);
}

}