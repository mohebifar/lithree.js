import Common from '../../core/common.js';
import Object3D from '../object3d.js';

export default
  function CubeFactory(size = 1) {
    var cube = new Object3D();

    cube.vertices = [
      // Front face
      -size, -size, size,
      size, -size, size,
      size, size, size,
      -size, size, size,

      // Back face
      -size, -size, -size,
      -size, size, -size,
      size, size, -size,
      size, -size, -size,

      // Top face
      -size, size, -size,
      -size, size, size,
      size, size, size,
      size, size, -size,

      // Bottom face
      -size, -size, -size,
      size, -size, -size,
      size, -size, size,
      -size, -size, size,

      // Right face
      size, -size, -size,
      size, size, -size,
      size, size, size,
      size, -size, size,

      // Left face
      -size, -size, -size,
      -size, -size, size,
      -size, size, size,
      -size, size, -size
    ];

    cube.vertexIndex = [
      0, 1, 2, 0, 2, 3,    // Front face
      4, 5, 6, 4, 6, 7,    // Back face
      8, 9, 10, 8, 10, 11,  // Top face
      12, 13, 14, 12, 14, 15, // Bottom face
      16, 17, 18, 16, 18, 19, // Right face
      20, 21, 22, 20, 22, 23  // Left face
    ];

    cube.vertexNormals = [
      // Front face
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,

      // Back face
      0.0, 0.0, -1.0,
      0.0, 0.0, -1.0,
      0.0, 0.0, -1.0,
      0.0, 0.0, -1.0,

      // Top face
      0.0, 1.0, 0.0,
      0.0, 1.0, 0.0,
      0.0, 1.0, 0.0,
      0.0, 1.0, 0.0,

      // Bottom face
      0.0, -1.0, 0.0,
      0.0, -1.0, 0.0,
      0.0, -1.0, 0.0,
      0.0, -1.0, 0.0,

      // Right face
      1.0, 0.0, 0.0,
      1.0, 0.0, 0.0,
      1.0, 0.0, 0.0,
      1.0, 0.0, 0.0,

      // Left face
      -1.0, 0.0, 0.0,
      -1.0, 0.0, 0.0,
      -1.0, 0.0, 0.0,
      -1.0, 0.0, 0.0
    ];

    cube.darwingFunction = Common.drawingFunctions.ELEMENTS;
    cube.drawingMode = Common.drawingMode.TRIANGLES;

    return cube;
  }