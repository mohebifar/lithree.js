import Vector3 from '../math/vector3.js';
import Matrix4 from '../math/matrix4.js';
import Color from '../core/color.js';
import Common from '../core/common.js';
import Material from '../material/material.js';

var objId = 0;

export default
class Object3D {

  /**
   * Constructor of Object3D
   *
   * @method constructor
   */
  constructor() {
    this.color = new Color();

    this.type = 'object';

    this.scale = new Vector3();
    this.position = new Vector3();
    this.rotation = new Vector3();

    this.vertices = [];
    this.vertexNormals = false;
    this.vertexIndex = false;
    this.vertexColor = false;
    this.textureCoords = false;

    this.index = objId++;

    this.buffers = {};

    this.material = new Material();

    this.drawingMode = Common.drawingMode.LINE_STRIP;
    this.darwingFunction = Common.drawingFunctions.ARRAYS;
  }

  /**
   * Get model view of this object by given camera
   *
   * @param camera
   * @returns {Matrix4}
   */
  getMatrix(camera) {
    var mvMatrix = new Matrix4();

    mvMatrix.lookAt(camera.position, camera.lookAt, camera.up);

    mvMatrix.translate(this.position);

    mvMatrix.rotateX(this.rotation.x);
    mvMatrix.rotateY(this.rotation.y);
    mvMatrix.rotateZ(this.rotation.z);

    return mvMatrix;
  }

}