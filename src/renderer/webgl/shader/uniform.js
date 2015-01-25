import Vector3 from '../../../math/vector3.js';
import Matrix3 from '../../../math/matrix3.js';
import Matrix4 from '../../../math/matrix4.js';

export default
class Uniform {

  /**
   * Constructor of Unifrom
   *
   * @method constructor
   * @param type
   * @param name
   * @param programmer
   */
  constructor(type, name, programmer) {
    this.type = type;
    this.name = name;

    this.onupdate = null;

    this._porgrammer = programmer;
  }

  /**
   * Allocate this uniform's location in shader program
   *
   * @method create
   */
  create() {
    this.location = this._porgrammer.renderer.gl.getUniformLocation(this._porgrammer.program, this.name);
  }

  /**
   * Call update function for this variable
   *
   * @method update
   */
  update() {
    if (typeof this.onupdate === 'function') {
      this.onupdate.apply(this);
    }
  }

  /**
   * Set value of this variable
   *
   * @todo Set value according to uniform type and value type
   * @method {*} value The value to set
   * @param value
   */
  value(value) {
    var gl = this._porgrammer.gl;

    if (value instanceof Vector3) {
      gl.uniform3fv(this.location, value.toArray());
    } else if (value instanceof Matrix4) {
      gl.uniformMatrix4fv(this.location, false, value.toArray());
    } else if (value instanceof Matrix3) {
      gl.uniformMatrix3fv(this.location, false, value.toArray());
    } else if (typeof value === 'object') {
      if (value.length === 4) {
        gl.uniform4fv(this.location, value);
      } else if (value.length === 3) {
        gl.uniform3fv(this.location, value);
      } else if (value.length === 9) {
        gl.uniformMatrix3fv(this.location, false, value);
      } else if (value.length === 16) {
        gl.uniformMatrix4fv(this.location, false, value);
      }
    } else if (typeof value === 'boolean') {
      gl.uniform1i(this.location, value);
    } else {
      gl.uniform1f(this.location, value);
    }
  }

}