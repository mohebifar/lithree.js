var ob_i = 0;

export default
class Object3D {

  constructor() {
    this.scale = new Vector3();
    this.position = new Vector3();
    this.rotation = new Vector3();

    this.vertices = [];
    this.vertexNormals = false;
    this.vertexIndex = false;
    this.vertexColor = false;
    this.textureCoords = false;

    this.index = ob_i++;

    this.buffers = {};

    this.drawingMode = Common.drawingMode.TRIANGLES;

    this.darwingFunction = 0;
    this.color = new Color();

    this.shader = false;

    this._mvMatrix = mat4.create();
  }

  getMatrix(camera) {
    var mvMatrix = mat4.create();

    mat4.lookAt(mvMatrix, camera.position, camera.lookAt, camera.up);

    mat4.translate(mvMatrix, mvMatrix, this.position);

    mat4.rotateX(mvMatrix, mvMatrix, this.rotation[0]);
    mat4.rotateY(mvMatrix, mvMatrix, this.rotation[1]);
    mat4.rotateZ(mvMatrix, mvMatrix, this.rotation[2]);

    return mvMatrix;
  }

}