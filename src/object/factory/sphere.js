import Common from '../../core/common.js';
import Object3D from '../object3d.js';

/**
 * Sphere factory
 *
 * @function SphereFactory
 * @param {Number} [radius=1]
 * @param {Number} [latitudeBands=30]
 * @param {Number} [longitudeBands=30]
 * @returns {Object3D}
 * @constructor
 */
export default
  function SphereFactory(radius = 1, latitudeBands = 30, longitudeBands = 30) {
    var latNumber, longNumber;

    var sphere = new Object3D();

    var vertexPositionData = [];
    var normalData = [];
    var textureCoordData = [];

    for (latNumber = 0; latNumber <= latitudeBands; latNumber++) {
      var theta = latNumber * Math.PI / latitudeBands;
      var sinTheta = Math.sin(theta);
      var cosTheta = Math.cos(theta);

      for (longNumber = 0; longNumber <= longitudeBands; longNumber++) {
        var phi = longNumber * 2 * Math.PI / longitudeBands;
        var sinPhi = Math.sin(phi);
        var cosPhi = Math.cos(phi);

        var x = cosPhi * sinTheta;
        var y = cosTheta;
        var z = sinPhi * sinTheta;
        var u = 1 - (longNumber / longitudeBands);
        var v = 1 - (latNumber / latitudeBands);

        normalData.push(x);
        normalData.push(y);
        normalData.push(z);
        textureCoordData.push(u);
        textureCoordData.push(v);
        vertexPositionData.push(radius * x);
        vertexPositionData.push(radius * y);
        vertexPositionData.push(radius * z);
      }
    }

    var indexData = [];
    for (latNumber = 0; latNumber < latitudeBands; latNumber++) {
      for (longNumber = 0; longNumber < longitudeBands; longNumber++) {
        var first = (latNumber * (longitudeBands + 1)) + longNumber;
        var second = first + longitudeBands + 1;
        indexData.push(first);
        indexData.push(second);
        indexData.push(first + 1);

        indexData.push(second);
        indexData.push(second + 1);
        indexData.push(first + 1);
      }
    }

    sphere.vertexIndex = indexData;
    sphere.vertexNormals = normalData;
    sphere.vertices = vertexPositionData;

    sphere.darwingFunction = Common.drawingFunctions.ELEMENTS;
    sphere.drawingMode = Common.drawingMode.TRIANGLES;

    return sphere;
  }