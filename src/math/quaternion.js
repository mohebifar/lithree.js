import Emitter from '../core/emitter.js';

export default
class Quaternion extends Emitter {

  constructor(x = 0, y = 0, z = 0, w = 1) {
    super();
    this._x = x;
    this._y = y;
    this._z = z;
    this._w = w;
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

  set w(w) {
    this._w = w;

    this.emit('update');
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

  get w() {
    return this._w;
  }

  setAxisAngle(axis, rad) {
    rad *= 0.5;
    var s = Math.sin(rad);

    this._x = s * axis.x;
    this._y = s * axis.y;
    this._z = s * axis.z;
    this._w = Math.cos(rad);

    this.emit('update');

    return this;
  }

  normalize() {
    var x = this._x,
      y = this._y,
      z = this._z,
      w = this._w;

    var len = x * x + y * y + z * z + w * w;

    if (len > 0) {
      len = 1 / Math.sqrt(len);
      this._x *= len;
      this._y *= len;
      this._z *= len;
      this._w *= len;
    }

    this.emit('update');

    return this
  }

  rotationTo(a, b) {
    var temp,
      xUnitVec3 = new Vector3(1, 0, 0),
      yUnitVec3 = new Vector3(0, 1, 0);

    var dot = a.dot(b);

    if (dot < -0.999999) {
      temp = xUnitVec3.cross(a);

      if (temp.getLength() < 0.000001) {
        temp = yUnitVec3.cross(a);
      }

      temp.normalize();
      this.setAxisAngle(temp, Math.PI);

      return this;
    } else if (dot > 0.999999) {
      this._x = 0;
      this._y = 0;
      this._z = 0;
      this._w = 1;

      this.emit('update');

      return this;
    } else {
      temp = a.cross(b);
      this._x = temp.x;
      this._y = temp.y;
      this._z = temp.z;
      this._w = 1 + dot;

      return this.normalize();
    }
  }


  rotateX(rad) {
    rad *= 0.5;

    var
      ax = this._x,
      ay = this._y,
      az = this._z,
      aw = this._w,
      bx = Math.sin(rad),
      bw = Math.cos(rad);

    this._x = ax * bw + aw * bx;
    this._y = ay * bw + az * bx;
    this._z = az * bw - ay * bx;
    this._w = aw * bw - ax * bx;

    this.emit('update');

    return this;
  }

  rotateY(rad) {
    rad *= 0.5;

    var
      ax = this._x,
      ay = this._y,
      az = this._z,
      aw = this._w,
      by = Math.sin(rad), bw = Math.cos(rad);

    this._x = ax * bw - az * by;
    this._y = ay * bw + aw * by;
    this._z = az * bw + ax * by;
    this._w = aw * bw - ay * by;

    this.emit('update');

    return this;
  }

  rotateZ(rad) {
    rad *= 0.5;

    var
      ax = this._x,
      ay = this._y,
      az = this._z,
      aw = this._w,
      bz = Math.sin(rad), bw = Math.cos(rad);

    this._x = ax * bw + ay * bz;
    this._y = ay * bw - ax * bz;
    this._z = az * bw + aw * bz;
    this._w = aw * bw - az * bz;

    this.emit('update');

    return this;
  }

}