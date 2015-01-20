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

    this.webGl = {
      shaderProgram: false,
      uniforms: {},
      attributes: {},
      buffers: {}
    };

    this.buffers = {

    };

    this.drawingMode = false;

    this.darwingFunction = 1;
    this.color = new Color();

    this.mvMatrix = mat4.create();
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

  get rotateX() {
    return this.rotation[0];
  }

  set rotateY(y) {
    this.rotation[1] = y;
  }

  get rotateY() {
    return this.rotation[1];
  }

  set rotateZ(z) {
    this.rotation[2] = z;
  }

  get rotateZ() {
    return this.rotation[2];
  }

}