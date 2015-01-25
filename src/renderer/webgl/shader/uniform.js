export default
class Uniform {

  constructor(type, name, programmer) {
    this.type = type;
    this.name = name;

    this.onchange = null;

    this._porgrammer = programmer;
  }

  create() {
    this.location = this._porgrammer.renderer.gl.getUniformLocation(this._porgrammer.program, this.name);
  }

  change() {
    if(typeof this.onchange === 'function') {
      this.onchange.apply(this);
    }
  }

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
    }
  }

}