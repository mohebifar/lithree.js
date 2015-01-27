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
    this.emit('update');
    this._x = x;
  }

  set y(y) {
    this.emit('update');
    this._y = y;
  }

  set z(z) {
    this.emit('update');
    this._z = z;
  }

  set(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(value, create = false) {
    var out;
    if (create) {
      out = this.clone();
    } else {
      out = this;
    }

    if (typeof value === 'object') {
      out.x += value.x;
      out.y += value.y;
      out.z += value.z;
    } else {
      out.x += value;
      out.y += value;
      out.z += value;
    }

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
      out.x -= value.x;
      out.y -= value.y;
      out.z -= value.z;
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
      out.x *= value.x;
      out.y *= value.y;
      out.z *= value.z;
    } else {
      out.x *= value;
      out.y *= value;
      out.z *= value;
    }

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
      out.x /= value.x;
      out.y /= value.y;
      out.z /= value.z;
    } else {
      out.multiply(1 / value);
    }

    return out;
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
  }

  dot(vector) {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  }

  cross(vector) {
    return new Vector3(this.y * vector.z - this.z * vector.y, this.z * vector.x - this.x * vector.z, this.x * vector.y - this.y * vector.x);
  }

  angle(vector) {
    return Math.acos(this.dot(vector) / this.distance(vector));
  }

  toArray() {
    return [this.x, this.y, this.z];
  }
}