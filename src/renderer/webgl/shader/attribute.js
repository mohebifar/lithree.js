/**
 * Class Attribute for vertex program
 *
 * @class Attribute
 */
export default
class Attribute {

  /**
   * Constructor of Attribute
   *
   * @constructor
   * @param {String} type
   * @param {String} name
   * @param {Shader} shader
   */
  constructor(type, name, shader) {
    this.type = type;
    this.name = name;

    this.onupdate = null;

    this.shader = shader;
    this._porgrammer = shader._programmer;
  }

  /**
   * Allocate location for this attribute
   *
   * @method create
   */
  create() {
    var gl = this._porgrammer.renderer.gl;
    this.location = gl.getAttribLocation(this._porgrammer.program, this.name);

    gl.enableVertexAttribArray(this.location);
  }

  /**
   * Call update function for this variable
   *
   * @method update
   */
  update() {
    if(typeof this.onupdate === 'function') {
      this.onupdate.apply(this, arguments);
    }
  }

  /**
   * Set value for this attribute
   *
   * @param value
   */
  value(value) {
    var gl = this._porgrammer.gl;

    if (value instanceof WebGLBuffer) {
      gl.bindBuffer(gl.ARRAY_BUFFER, value);
      gl.vertexAttribPointer(this.location, value.itemSize, gl.FLOAT, false, 0, 0);
    }
  }

}