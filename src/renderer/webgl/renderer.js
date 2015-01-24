import Camera from '../../core/camera.js';
import Common from '../../core/common.js';
import ShaderProgrammer from 'shader/programmer.js';
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
  constructor(width, height, world, color = null) {
    super.constructor(width, height);

    this.world = world;
    this.camera = new Camera();

    this.camera.aspect = this.width / this.height;
    this.camera.updatePerspective();

    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('width', this.width);
    this.canvas.setAttribute('height', this.height);
    this.color = color;

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

    if(this.color !== null) {
      this.gl.clearColor(this.color[0], this.color[1], this.color[2], this.color[3]);
    }

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

      object.shader = new ShaderProgrammer(this, object);

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

      if (object.vertexNormals) {
        object.buffers.normals = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, object.buffers.normals);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(object.vertexNormals), this.gl.STATIC_DRAW);

        object.buffers.normals.itemSize = 3;
        object.buffers.normals.numItems = object.vertexNormals.length;
      }

      if (object.vertexIndex) {
        object.buffers.vertexIndex = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, object.buffers.vertexIndex);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(object.vertexIndex), this.gl.STATIC_DRAW);

        object.buffers.vertexIndex.itemSize = 1;
        object.buffers.vertexIndex.numItems = object.vertexIndex.length;
      }

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

      var object = this.world.children[i];
      var buffers= object.buffers;

      object.shader.use();
      object.shader.assignValues();

      if (object.darwingFunction === Common.drawingFunctions.ELEMENTS) {
        this.gl.drawElements(object.drawingMode, buffers.vertexIndex.numItems, this.gl.UNSIGNED_SHORT, 0);
      } else if (object.darwingFunction === Common.drawingFunctions.ARRAYS)  {
        this.gl.drawArrays(object.drawingMode, 0, buffers.vertices.numItems);
      }
    }

  }

}