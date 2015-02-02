import Vector3 from '../math/vector3.js';
import Matrix4 from '../math/matrix4.js';
import Color from '../core/color.js';
import Common from '../core/common.js';
import Material from '../material/material.js';

var objId = 0;

export default
class Object3D {

  /**
   * Constructor of Object3D
   *
   * @method constructor
   */
  constructor() {
    this.type = 'object';

    this.scale = new Vector3(1, 1, 1);
    this.position = new Vector3();
    this.rotation = new Quaternion();
    this.origin = new Vector3();

    this.vertices = [];
    this.vertexNormals = false;
    this.vertexIndex = false;
    this.vertexColor = false;
    this.textureCoords = false;

    this.index = objId++;

    this.buffers = {};

    this.material = new Material();
    this.color = this.material.color;

    this.drawingMode = Common.drawingMode.LINE_STRIP;
    this.darwingFunction = Common.drawingFunctions.ARRAYS;

    this.initiated = false;

    this.display = true;
  }

  /**
   * Update model matrix
   *
   * @returns {Matrix4}
   */
  getMatrix() {
    this.matrix = Matrix4.fromRotationTranslationScaleOrigin(
      this.rotation,
      this.position,
      this.scale,
      this.origin
    );

    return this.matrix;
  }

}