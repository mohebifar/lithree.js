import Renderer from '../renderer.js';

export default
class WebGLRenderer extends Renderer {

  /**
   * Constructs a new WebGl Renderer
   *
   * @param {Number} width
   * @param {Number} height
   * @param {World} world
   */
  constructor(width, height, world) {
    super.constructor(width, height);

    this.world = world;
    this.camera = new Camera();

    this.camera.aspect = this.width / this.height;
    this.camera.updatePerspective();

    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('width', this.width);
    this.canvas.setAttribute('height', this.height);

    this.initGl();
  }

  /**
   * Initiate the WebGl context
   *
   * @method initGl
   */
  initGl() {

    /**
     * The WebGl Rendering context
     *
     * @type {WebGLRenderingContext}
     */
    this.gl = this.canvas.getContext('experimental-webgl');

    this.gl.viewportWidth = this.canvas.width;
    this.gl.viewportHeight = this.canvas.height;

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.enable(this.gl.DEPTH_TEST);

  }

  /**
   * Initiate shapes with buffers and shader
   *
   * @method initShapes
   */
  initShapes() {
    for (var i = this.world.children.length; i--;) {
      var object = this.world.children[i];

      if (object.drawingMode === false) {
        object.drawingMode = this.gl.LINE_STRIP;
      }

      object.buffers.vertices = this.gl.createBuffer();

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, object.buffers.vertices);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(object.vertices), this.gl.STATIC_DRAW);

      object.buffers.vertices.itemSize = 3;
      object.buffers.vertices.numItems = object.vertices.length / 3;

      if (object.vertexColor) {
        object.buffers.vertexColor = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, object.buffers.vertexColor);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(object.vertexColor), this.gl.STATIC_DRAW);

        object.buffers.vertexColor.itemSize = 4;
        object.buffers.vertexColor.numItems = object.vertexColor.length;
      }

      if (object.vertexIndex) {
        object.buffers.vertexIndex = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, object.buffers.vertexIndex);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(object.vertexIndex), this.gl.STATIC_DRAW);

        object.buffers.vertexIndex.itemSize = 1;
        object.buffers.vertexIndex.numItems = object.vertexIndex.length;
      }

      var vertexShader = this.compileShader('attribute vec3 aVertexPosition;uniform mat4 uMVMatrix;uniform mat4 uPMatrix;void main(void) {gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);}', this.gl.VERTEX_SHADER);
      var fragmentShader = this.compileShader('precision mediump float; uniform vec4 uvColor; void main(void) {gl_FragColor = uvColor;}', this.gl.FRAGMENT_SHADER);

      var shaderProgram = this.createProgram(vertexShader, fragmentShader);

      shaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(shaderProgram, "aVertexPosition");

      this.gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

      shaderProgram.pMatrixUniform = this.gl.getUniformLocation(shaderProgram, "uPMatrix");
      shaderProgram.mvMatrixUniform = this.gl.getUniformLocation(shaderProgram, "uMVMatrix");
      shaderProgram.colorUniform = this.gl.getUniformLocation(shaderProgram, "uvColor");

      object.shaderProgram = shaderProgram;
    }
  }

  /**
   * Draw the scene.
   *
   * @method draw
   */
  draw() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    for (var i = this.world.children.length; i--;) {

      var mvMatrix = mat4.create();

      var object = this.world.children[i];
      var buffers= object.buffers;
      var shaderProgram = object.shaderProgram;

      this.gl.useProgram(shaderProgram);

      mat4.identity(mvMatrix);
      mat4.lookAt(mvMatrix, this.camera.position, this.camera.lookAt, this.camera.up);
      mat4.translate(mvMatrix, mvMatrix, object.position);
      mat4.rotateX(mvMatrix, mvMatrix, object.rotation[0]);
      mat4.rotateY(mvMatrix, mvMatrix, object.rotation[1]);

      mat4.rotateZ(mvMatrix, mvMatrix, object.rotation[2]);

      // Set Matrix Uniform
      this.gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, this.camera.matrix);
      this.gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
      this.gl.uniform4fv(shaderProgram.colorUniform, object.color.toArray());

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.vertices);
      this.gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, buffers.vertices.itemSize, this.gl.FLOAT, false, 0, 0);

      if (object.darwingFunction == 0) {
        this.gl.drawElements(object.drawingMode, buffers.vertexIndex.numItems, this.gl.UNSIGNED_SHORT, 0);
      } else {
        this.gl.drawArrays(object.drawingMode, 0, buffers.vertices.numItems);
      }
    }

  }

  /**
   * Creates and compiles a shader.
   *
   * @method compileShader
   * @param {string} shaderSource The GLSL source code for the shader.
   * @param {number} shaderType The type of shader, VERTEX_SHADER or FRAGMENT_SHADER.
   * @return {WebGLShader} The shader.
   */
  compileShader(shaderSource, shaderType) {
    // Create the shader object
    var shader = this.gl.createShader(shaderType);

    // Set the shader source code.
    this.gl.shaderSource(shader, shaderSource);

    // Compile the shader
    this.gl.compileShader(shader);

    // Check if it compiled
    var success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
    if (!success) {
      // Something went wrong during compilation; get the error
      throw "could not compile shader:" + this.gl.getShaderInfoLog(shader);
    }

    return shader;
  }

  /**
   * Creates a program from 2 shaders.
   *
   * @method createProgram
   * @param {WebGLShader} vertexShader A vertex shader.
   * @param {WebGLShader} fragmentShader A fragment shader.
   * @return {WebGLProgram} A program.
   */
  createProgram(vertexShader, fragmentShader) {
    // create a program.
    var program = this.gl.createProgram();

    // attach the shaders.
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);

    // link the program.
    this.gl.linkProgram(program);

    // Check if it linked.
    var success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
    if (!success) {
      // something went wrong with the link
      throw ("program filed to link:" + this.gl.getProgramInfoLog(program));
    }

    return program;
  }

}