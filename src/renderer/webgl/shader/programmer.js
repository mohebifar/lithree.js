/**
 * This class is used to create and compile a glsl program.
 *
 * @author Mohamad Mohebifar
 */
export default
class ShaderProgrammer {

  constructor(renderer, object) {
    this.object = object;
    this.renderer = renderer;
    this.uniforms = {};
    this.attributes = {};

    this.program = false;
    this.gl = renderer.gl;
    this.create();
  }

  vertex() {
    var pars = '',
      main = '';

    pars += ShaderChunks.vertex.pars.default;

    main += ShaderChunks.vertex.main.default;

    for(var i in this.renderer.world.lights) {
      var light = this.renderer.world.lights[i];
      var _i = light.index;

      pars += ShaderChunks.vertex.pars.directionalLight(_i);
      main += ShaderChunks.vertex.main.directionalLight(_i);
    }

    var program = `${pars} void main() { ${main} }`;
    return this.compile(program, WebGLRenderingContext.VERTEX_SHADER);
  }

  fragment() {
    var pars = '',
      main = '';

    pars += ShaderChunks.fragment.pars.default;
    pars += ShaderChunks.fragment.pars.color;

    main += ShaderChunks.fragment.main.color;

    if(this.renderer.world.lights.length > 0) {
      pars += ShaderChunks.fragment.pars.directionalLight;
      main += ShaderChunks.fragment.main.directionalLight;
    }

    var program = `${pars} void main() { ${main} }`;
    return this.compile(program, WebGLRenderingContext.FRAGMENT_SHADER);
  }

  assignValues() {
    var obj = this.object;
    var buffers = obj.buffers;

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.vertices);
    this.attributeValue('aVertexPosition', buffers.vertices);

    try {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.normals);
      this.attributeValue('aVertexNormal', buffers.normals);
    } catch (err) {

    }

    var mvMatrix = obj.getMatrix(this.renderer.camera);

    // Set Matrix Uniform
    this.uniformValue('uPMatrix', this.renderer.camera.matrix);
    this.uniformValue('uMVMatrix', obj.getMatrix(this.renderer.camera));
    this.uniformValue('uvColor', obj.color.toArray());

    for(var i in this.renderer.world.lights) {
      var light = this.renderer.world.lights[i];
      var _i = light.index;

      this.uniformValue('uLightingDirection' + _i, light.direction);
      this.uniformValue('uDirectionalColor' + _i, light.color.array);
    }

    var normalMatrix = mat3.create();
    mat4.toInverseMat3(mvMatrix, normalMatrix);
    mat3.transpose(normalMatrix, normalMatrix);

    this.uniformValue('uNMatrix', normalMatrix);
  }

  /**
   * Get a uniform location
   *
   * @method uniformLocation
   * @param name
   */
  uniformLocation(name) {
    this.uniforms[name] = this.gl.getUniformLocation(this.program, name);
  }

  /**
   * Get an attribute location
   *
   * @method attributeLocation
   * @param name
   */
  attributeLocation(name) {
    this.attributes[name] = this.gl.getAttribLocation(this.program, name);

    if (this.attributes[name] === -1) {
      throw `Attribute ${name} cannot be located`;
    }

    this.gl.enableVertexAttribArray(this.attributes[name]);
  }

  /**
   * Set a uniform value
   *
   * @param name
   * @param value
   */
  uniformValue(name, value) {
    var gl = this.gl;

    if (typeof this.uniforms[name] === 'undefined') {
      this.uniformLocation(name);
    }

    if (value.length === 4) {
      gl.uniform4fv(this.uniforms[name], value);
    } else if (value.length === 3) {
      gl.uniform3fv(this.uniforms[name], value);
    } else if (value.length === 9) {
      gl.uniformMatrix3fv(this.uniforms[name], false, value);
    } else if (value.length === 16) {
      gl.uniformMatrix4fv(this.uniforms[name], false, value);
    }
  }

  /**
   * Set an attribute value
   *
   * @param name
   * @param value
   */
  attributeValue(name, value) {
    var gl = this.gl;

    if (typeof this.attributes[name] === 'undefined') {
      this.attributeLocation(name);
    }

    if(this.attributes[name] === -1) {
      return;
    }

    this.gl.vertexAttribPointer(this.attributes[name], value.itemSize, this.gl.FLOAT, false, 0, 0);
  }

  /**
   * Use this program.
   *
   * @method use
   */
  use() {
    this.gl.useProgram(this.program);
  }

  /**
   * Creates and compiles a shader.
   *
   * @method compile
   * @param {string} source The GLSL source code for the shader.
   * @param {number} shaderType The type of shader, VERTEX_SHADER or FRAGMENT_SHADER.
   * @return {WebGLShader} The shader.
   */
  compile(source, shaderType) {
    var gl = this.gl;
    // Create the shader object
    var shader = gl.createShader(shaderType);

    // Set the shader source code.
    gl.shaderSource(shader, source);

    // Compile the shader
    gl.compileShader(shader);

    // Check if it compiled
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

    if (!success) {
      // Something went wrong during compilation; get the error
      throw "Could not compile shader:" + gl.getShaderInfoLog(shader);
    }

    return shader;
  }

  create() {
    var gl = this.gl;
    var program = gl.createProgram();

    gl.attachShader(program, this.vertex());
    gl.attachShader(program, this.fragment());
    gl.linkProgram(program);

    var success = gl.getProgramParameter(program, gl.LINK_STATUS);

    if (!success) {
      // something went wrong with the link
      throw ("program filed to link:" + gl.getProgramInfoLog(program));
    }

    this.program = program;

    return program;
  }

}