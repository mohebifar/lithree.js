var ob_i = 0;

export default
class Object3D {

  constructor() {
    this.scale = vec3.create();
    this.position = vec3.create();
    this.rotation = vec3.create();

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

  set x(x) {
    this.position[0] = x;
  }

  set y(y) {
    this.position[1] = y;
  }

  set z(z) {
    this.position[2] = z;
  }

  get x() {
    return this.position[0];
  }

  get y() {
    return this.position[1];
  }

  get z() {
    return this.position[2];
  }

  set rotateX(x) {
    this.rotation[0] = x;
  }

  set rotateY(y) {
    this.rotation[1] = y;
  }

  set rotateZ(z) {
    this.rotation[2] = z;
  }

  get rotateX() {
    return this.rotation[0];
  }

  get rotateY() {
    return this.rotation[1];
  }

  get rotateZ() {
    return this.rotation[2];
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