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

class Rectangle : public Shape {
public:
    Rectangle(float x, float y, float width, float height);
    void render(RenderContext* context) override;
    Rect getBounds() const override;
    
    void setPosition(float x, float y);
    void setSize(float width, float height);
    void setColor(float r, float g, float b, float a = 1.0f);
    
private:
    Rect bounds;
    struct Color { float r, g, b, a; } color;
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
    
    // Rectangle drawing functions
    size_t addRectangle(float x, float y, float width, float height);
    void setRectangleColor(size_t index, float r, float g, float b, float a = 1.0f);
    
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
    studio::DesignEngine* engine_create();
    void engine_destroy(studio::DesignEngine* engine);
    bool engine_initialize(studio::DesignEngine* engine, int width, int height);
    void engine_render(studio::DesignEngine* engine);
    void engine_set_canvas_size(studio::DesignEngine* engine, int width, int height);
    void engine_mouse_down(studio::DesignEngine* engine, float x, float y);
    void engine_mouse_move(studio::DesignEngine* engine, float x, float y);
    void engine_mouse_up(studio::DesignEngine* engine, float x, float y);
    
    // Rectangle functions
    size_t engine_add_rectangle(studio::DesignEngine* engine, float x, float y, float width, float height);
    void engine_set_rectangle_color(studio::DesignEngine* engine, size_t index, float r, float g, float b, float a);
    void engine_clear_shapes(studio::DesignEngine* engine);
}

}