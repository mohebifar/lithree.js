import Matrix4 from '../math/matrix4.js';
import Vector3 from '../math/vector3.js';

export default
class Camera {
  constructor(fovy = 0.785398, aspect = 1, near = 0.1, far = 100) {
    this.fovy = fovy;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    this.matrix = new Matrix4();
    this.lookAt = new Vector3();
    this.position = new Vector3();
    this.up = new Vector3();
    this._zoom = 1;
  }

  set zoom(zoom) {
    if (zoom < 1) {
      throw 'Zoom should be equal or greater than 1';
    }

    this._zoom = zoom;
  }

  get zoom() {
    return this._zoom;
  }


  updatePerspective() {
    var fovy = 2 * Math.atan(Math.tan(this.fovy * 0.5) / this._zoom);
    this.matrix.perspective(fovy, this.aspect, this.near, this.far);
  }
}