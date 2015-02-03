import PerspectiveCamera from '../../camera/perspective-camera.js';
import Common from '../../core/common.js';
import ShaderProgrammer from 'shader/programmer.js';
import Renderer from '../renderer.js';

/**
 * Renderer for WebGL canvaas
 *
 * @class WebGLRenderer
 */
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

    this.world = world;
    this.camera = new PerspectiveCamera();

    this.camera.aspect = this.width / this.height;
    this.camera.getProjection();

    this.canvas = document.createElement('canvas');

    this.initGl();

    this.setSize(width, height);
    this.setBackgroundColor(color);

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
    this.gl = this.canvas.getContext('webgl');

    this.gl.enable(this.gl.DEPTH_TEST);

  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
    this.canvas.setAttribute('width', width);
    this.canvas.setAttribute('height', height);
    this.gl.viewport(0, 0, width, height);
    this.camera.aspect = width / height;
    this.camera.getProjection();
  }

  setBackgroundColor(color) {
    this.color = color;

    if (color !== null) {
      color = color.array;
      this.gl.clearColor(color[0], color[1], color[2], color[3]);
    }
  }

  /**
   * Initiate shapes with buffers and shader
   *
   * @method initShapes
   */
  initShapes() {

    for (var i = this.world.children.length; i--;) {

      this.initShape(this.world.children[i]);

    }

  }

  initShape(object) {

    if (!object.initiated) {
      // Create buffers
      object.buffers.vertices = this.gl.createBuffer();
      object.buffers.vertexColor = this.gl.createBuffer();
      object.buffers.normals = this.gl.createBuffer();
      object.buffers.vertexIndex = this.gl.createBuffer();

      // Create shader programmer
      object.shader = new ShaderProgrammer(this, object);

      // Set flag
      object.initiated = true;
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

      let object = this.world.children[i];

      if(! object.display) {
        continue;
      }

      let buffers = object.buffers;

      this.initShape(object);

      object.shader.use();
      object.shader.assignValues();

      if (object.darwingFunction === Common.drawingFunctions.ELEMENTS) {
        this.gl.drawElements(object.drawingMode, buffers.vertexIndex.numItems, this.gl.UNSIGNED_SHORT, 0);
      } else if (object.darwingFunction === Common.drawingFunctions.ARRAYS) {
        this.gl.drawArrays(object.drawingMode, 0, buffers.vertices.numItems);
      }

    }

  }

}