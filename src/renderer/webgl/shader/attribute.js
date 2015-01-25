export default
class Attribute {

  constructor(type, name, programmer) {
    this.type = type;
    this.name = name;

    this.onchange = null;

    this._porgrammer = programmer;
  }

  create() {
    var gl = this._porgrammer.renderer.gl;
    this.location = gl.getAttribLocation(this._porgrammer.program, this.name);
    gl.enableVertexAttribArray(this.location);
  }

  change() {
    if(typeof this.onchange === 'function') {
      this.onchange.apply(this);
    }
  }

  value(value) {
    var gl = this._porgrammer.gl;

    if (value instanceof WebGLBuffer) {
      gl.bindBuffer(gl.ARRAY_BUFFER, value);
      gl.vertexAttribPointer(this.location, value.itemSize, gl.FLOAT, false, 0, 0);
    }
  }

}