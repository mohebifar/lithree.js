import Vector3 from '../math/vector3.js';
import Matrix4 from '../math/matrix4.js';
import Quaternion from '../math/quaternion.js';
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
    this.getMatrix();
  }

  set rotation(rotation) {
    var _this = this;
    this._rotation = rotation;
    rotation.on('update', function () {
      _this.getMatrix();
    });
  }

  get rotation() {
    return this._rotation;
  }

  set position(position) {
    var _this = this;
    this._position = position;
    position.on('update', function () {
      _this.getMatrix();
    });
  }

  get position() {
    return this._position;
  }

  set scale(scale) {
    var _this = this;
    this._scale = scale;
    scale.on('update', function () {
      _this.getMatrix();
    });
  }

  get scale() {
    return this._scale;
  }

  set origin(origin) {
    var _this = this;
    this._origin = origin;
    origin.on('update', function () {
      _this.getMatrix();
    });
  }

  get origin() {
    return this._origin;
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