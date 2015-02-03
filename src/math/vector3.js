import Emitter from '../core/emitter.js';

export default
class Vector3 extends Emitter {

  constructor(x = 0, y = 0, z = 0) {
    super();

    this._x = x;
    this._y = y;
    this._z = z;
  }

  clone() {
    return new Vector3(this.x, this.y, this.z);
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  get z() {
    return this._z;
  }

  set x(x) {
    this._x = x;
    this.emit('update');
  }

  set y(y) {
    this._y = y;
    this.emit('update');
  }

  set z(z) {
    this._z = z;
    this.emit('update');
  }

  set(x, y, z) {
    this._x = x;
    this._y = y;
    this._z = z;

    this.emit('update');
  }

  add(value, create = false) {
    var out;
    if (create) {
      out = this.clone();
    } else {
      out = this;
    }

    if (typeof value === 'object') {
      out._x += value.x;
      out._y += value.y;
      out._z += value.z;
    } else {
      out._x += value;
      out._y += value;
      out._z += value;
    }

    this.emit('update');
    return out;
  }

  subtract(value, create = false) {
    var out;
    if (create) {
      out = this.clone();
    } else {
      out = this;
    }

    if (typeof value === 'object') {
      out._x -= value.x;
      out._y -= value.y;
      out._z -= value.z;

      this.emit('update');
    } else {
      out.add(-value);
    }

    return out;
  }

  multiply(value, create = false) {
    var out;
    if (create) {
      out = this.clone();
    } else {
      out = this;
    }

    if (typeof value === 'object') {
      out._x *= value.x;
      out._y *= value.y;
      out._z *= value.z;
    } else {
      out._x *= value;
      out._y *= value;
      out._z *= value;
    }

    this.emit('update');

    return out;
  }

  divide(value, create = false) {
    var out;
    if (create) {
      out = this.clone();
    } else {
      out = this;
    }

    if (typeof value === 'object') {
      out._x /= value.x;
      out._y /= value.y;
      out._z /= value.z;

      this.emit('update');
    } else {
      out.multiply(1 / value);
    }

    return out;
  }

  copy(vector) {
    this.set(vector.x, vector.y, vector.z);

    return this;
  }

  distance(vector) {
    var x = vector.x - this.x,
      y = vector.y - this.y,
      z = vector.z - this.z;

    return Math.sqrt(x * x + y * y + z * z);
  }

  getLength() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  normalize() {
    this.divide(this.getLength());
    return this;
  }

  dot(vector) {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  }

  cross(vector) {
    return new Vector3(this.y * vector.z - this.z * vector.y, this.z * vector.x - this.x * vector.z, this.x * vector.y - this.y * vector.x);
  }

  angle(vector) {
    return Math.acos(this.dot(vector) / this.getLength() / vector.getLength());
  }

  unproject(camera) {
    var m = camera.getMatrix(),
      p = camera.getProjection().clone();

    var matrix = Matrix4.multiplyMatrices(m, p.invert());
    return this.applyProjection(matrix);
  }

  applyProjection(matrix) {

    var x = this.x, y = this.y, z = this.z;

    var d = 1 / ( matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15] ); // perspective divide

    this._x = ( matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12] ) * d;
    this._y = ( matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13] ) * d;
    this._z = ( matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14] ) * d;

    this.emit('update');

    return this;

  }

  toArray() {
    return [this.x, this.y, this.z];
  }
}