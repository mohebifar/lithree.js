import Common from '../../core/common.js';
import Vector3 from '../../math/vector3.js';
import Object3D from '../object3d.js';

/**
 * Cylinder factory
 *
 * @function CylinderFactory
 * @param {Number} [height=2]
 * @param {Number} [radiusTop=1]
 * @param {Number} [radiusBottom=1]
 * @param {Number} [steps=20]
 * @returns {Object3D}
 * @constructor
 */
export default
  function CylinderFactory(height = 2, radiusTop = 1, radiusBottom = 1, steps = 20) {
    var i, a;

    var cylinder = new Object3D();

    cylinder.vertexIndex = [];
    cylinder.vertexNormals = [];

    var step = Math.PI / (steps - 1);

    steps *= 2;

    var heightTop = height / 2, heightBottom = height / -2;

    for (a = 0, i = 1; i <= steps; a += step, i++) {
      var positionTop = new Vector3(heightTop, Math.cos(a) * radiusTop, Math.sin(a) * radiusTop);
      var positionBottom = new Vector3(heightBottom, Math.cos(a) * radiusBottom, Math.sin(a) * radiusBottom);

      var crossed = positionTop.cross(positionBottom);

      cylinder.vertexNormals.push(crossed.x, crossed.y, crossed.z);
      cylinder.vertexNormals.push(crossed.x, crossed.y, crossed.z);

      cylinder.vertices.push(positionTop.x, positionTop.y, positionTop.z);
      cylinder.vertices.push(positionBottom.x, positionBottom.y, positionBottom.z);
    }

    for (i = 0; i < cylinder.vertices.length / 3; i++) {
      cylinder.vertexIndex.push(i);
    }

    cylinder.darwingFunction = Common.drawingFunctions.ELEMENTS;
    cylinder.drawingMode = Common.drawingMode.TRIANGLE_STRIP;

    return cylinder;
  }