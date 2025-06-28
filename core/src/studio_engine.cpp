#include "studio_engine.h"
#include <iostream>
#include <algorithm>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#include <emscripten/html5.h>
#endif

namespace studio {

class DesignEngine::Impl {
public:
    int width = 0;
    int height = 0;
    std::vector<std::unique_ptr<Shape>> shapes;
    bool initialized = false;
    
    // Mouse state
    bool mouseDown = false;
    Point lastMousePos = {0, 0};
};

DesignEngine::DesignEngine() : pImpl(std::make_unique<Impl>()) {}

DesignEngine::~DesignEngine() = default;

bool DesignEngine::initialize(int width, int height) {
    pImpl->width = width;
    pImpl->height = height;
    pImpl->initialized = true;
    
    std::cout << "Design Engine initialized: " << width << "x" << height << std::endl;
    return true;
}

void DesignEngine::resize(int width, int height) {
    pImpl->width = width;
    pImpl->height = height;
}

void DesignEngine::render() {
    if (!pImpl->initialized) return;
    
    // Basic render loop - will be extended with Skia
    for (const auto& shape : pImpl->shapes) {
        // shape->render(renderContext);
    }
}

void DesignEngine::addShape(std::unique_ptr<Shape> shape) {
    pImpl->shapes.push_back(std::move(shape));
}

void DesignEngine::removeShape(size_t index) {
    if (index < pImpl->shapes.size()) {
        pImpl->shapes.erase(pImpl->shapes.begin() + index);
    }
}

void DesignEngine::clearShapes() {
    pImpl->shapes.clear();
}

void DesignEngine::setCanvasSize(int width, int height) {
    resize(width, height);
}

void DesignEngine::onMouseDown(float x, float y) {
    pImpl->mouseDown = true;
    pImpl->lastMousePos = {x, y};
}

void DesignEngine::onMouseMove(float x, float y) {
    if (pImpl->mouseDown) {
        // Handle drag
    }
    pImpl->lastMousePos = {x, y};
}

void DesignEngine::onMouseUp(float x, float y) {
    pImpl->mouseDown = false;
    pImpl->lastMousePos = {x, y};
}

} // namespace studio

// C interface implementation
extern "C" {

studio::DesignEngine* engine_create() {
    return new studio::DesignEngine();
}

void engine_destroy(studio::DesignEngine* engine) {
    delete engine;
}

bool engine_initialize(studio::DesignEngine* engine, int width, int height) {
    return engine->initialize(width, height);
}

void engine_render(studio::DesignEngine* engine) {
    engine->render();
}

void engine_set_canvas_size(studio::DesignEngine* engine, int width, int height) {
    engine->setCanvasSize(width, height);
}

void engine_mouse_down(studio::DesignEngine* engine, float x, float y) {
    engine->onMouseDown(x, y);
}

void engine_mouse_move(studio::DesignEngine* engine, float x, float y) {
    engine->onMouseMove(x, y);
}

void engine_mouse_up(studio::DesignEngine* engine, float x, float y) {
    engine->onMouseUp(x, y);
}

}