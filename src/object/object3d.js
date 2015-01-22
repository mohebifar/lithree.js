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
  }

  getMatrix(camera) {
    var mvMatrix = new Matrix4();

    mvMatrix.lookAt(camera.position, camera.lookAt, camera.up);

    mvMatrix.translate(this.position);

    mvMatrix.rotateX(this.rotation[0]);
    mvMatrix.rotateY(this.rotation[1]);
    mvMatrix.rotateZ(this.rotation[2]);

    return mvMatrix;
  }

}