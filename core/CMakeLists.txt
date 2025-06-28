cmake_minimum_required(VERSION 3.15)
project(DesignStudioCore)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Emscripten specific settings
if(EMSCRIPTEN)
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s USE_WEBGL2=1")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s WASM=1")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s ALLOW_MEMORY_GROWTH=1")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s NO_EXIT_RUNTIME=1")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s EXPORTED_RUNTIME_METHODS=['ccall','cwrap']")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s EXPORTED_FUNCTIONS=['_engine_create','_engine_destroy','_engine_initialize','_engine_render','_engine_set_canvas_size','_engine_mouse_down','_engine_mouse_move','_engine_mouse_up','_engine_add_rectangle','_engine_set_rectangle_color','_engine_clear_shapes','_malloc','_free']")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s MODULARIZE=1")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s EXPORT_NAME='DesignStudioModule'")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -O2")
    
    # Development flags (remove for production)
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s ASSERTIONS=1")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s SAFE_HEAP=1")
endif()

# Include directories
include_directories(include)

# Source files
set(SOURCES
    src/studio_engine.cpp
)

# Create the library
if(EMSCRIPTEN)
    add_executable(design_studio_core ${SOURCES})
else()
    add_library(design_studio_core ${SOURCES})
endif()

# Set output directory
set_target_properties(design_studio_core PROPERTIES
    ARCHIVE_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/lib"
    LIBRARY_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/lib"
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/bin"
)

if(EMSCRIPTEN)
    # Output WASM files to frontend public directory
    set_target_properties(design_studio_core PROPERTIES
        SUFFIX ".js"
        RUNTIME_OUTPUT_DIRECTORY "${CMAKE_SOURCE_DIR}/../frontend/public"
    )
    # Set output name to match expected module name
    set_target_properties(design_studio_core PROPERTIES
        OUTPUT_NAME "DesignStudioModule"
    )
endif()

# Future: Add external libraries
# find_package(PkgConfig REQUIRED)
# pkg_check_modules(SKIA REQUIRED skia)
# target_link_libraries(design_studio_core ${SKIA_LIBRARIES})
# target_include_directories(design_studio_core PRIVATE ${SKIA_INCLUDE_DIRS})