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
    this.projectionMatrix = new Matrix4();
    this.viewMatrix = new Matrix4();
    this.lookAt = new Vector3();
    this.position = new Vector3();
    this.rotation = new Quaternion();
    this.up = new Vector3(0, 1, 0);
    this._zoom = 1;

    var _this = this;

    _this.position.on('update', function () {
      _this.getMatrix();
    });

    _this.rotation.on('update', function () {
      _this.getMatrix();
    });

    _this.getMatrix();
  }

  /**
   * Declares zoom
   *
   * @property {Number} [zoom=1]
   */
  set zoom(zoom) {
    this.getProjection();

    if (zoom < 0) {
      throw 'Zoom should be equal or greater than 0';
    }

    this._zoom = zoom;
  }

  get zoom() {
    return this._zoom;
  }

  /**
   * @method getProjection
   */
  getProjection() {
    var fovy = 2 * Math.atan(Math.tan(this.fovy * 0.5) / this._zoom);
    this.projectionMatrix.identity();
    this.projectionMatrix.perspective(fovy, this.aspect, this.near, this.far);

    return this.projectionMatrix;
  }

  getMatrix() {
    this.viewMatrix = Matrix4.fromRotationTranslationScaleOrigin(this.rotation, this.position, new Vector3(1, 1, 1), new Vector3());

    return this.viewMatrix;
  }

}