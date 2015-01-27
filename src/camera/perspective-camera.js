import Matrix4 from '../math/matrix4.js';
import Vector3 from '../math/vector3.js';

export default
class PerspectiveCamera {

  /**
   * Constructor of Perspective camera
   *
   * @param {Number} [fovy=0.785398]
   * @param {Number} [aspect=1]
   * @param {Number} [near=0.1]
   * @param {Number} [far=100]
   */
  constructor(fovy = 0.785398, aspect = 1, near = 0.1, far = 100) {
    this.fovy = fovy;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    this.matrix = new Matrix4();
    this.lookAt = new Vector3();
    this.position = new Vector3();
    this.rotation = new Vector3();
    this.up = new Vector3();
    this._zoom = 1;

    var _this = this;
  }

  /**
   * Declares zoom
   *
   * @property {Number} [zoom=1]
   */
  set zoom(zoom) {
    if (zoom < 0) {
      throw 'Zoom should be equal or greater than 0';
    }

    this._zoom = zoom;
  }

  get zoom() {
    return this._zoom;
  }

  /**
   * @method updatePerspective
   */
  updatePerspective() {
    var fovy = 2 * Math.atan(Math.tan(this.fovy * 0.5) / this._zoom);
    this.matrix.identity();
    this.matrix.perspective(fovy, this.aspect, this.near, this.far);
  }

  getMatrix() {
    var matrix = new Matrix4();

    matrix.identity();
    matrix.translate(this.position);
    matrix.rotateX(this.rotation.x);
    matrix.rotateY(this.rotation.y);
    matrix.rotateZ(this.rotation.z);

    return matrix;
  }

}