export default
class Quaternion {

  constructor(x = 0, y = 0, z = 0, w = 1) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._w = w;
  }

  set x(x) {
    this._x = x;
  }

  set y(y) {
    this._y = y;
  }

  set z(z) {
    this._z = z;
  }

  set w(w) {
    this._w = w;
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
    rad = rad * 0.5;
    var s = Math.sin(rad);
    this.x = s * axis.x;
    this.y = s * axis.y;
    this.z = s * axis.z;
    this.w = Math.cos(rad);
    return this;
  }

  normalize() {
    var x = this.x,
      y = this.y,
      z = this.z,
      w = this.w;
    var len = x * x + y * y + z * z + w * w;

    if (len > 0) {
      len = 1 / Math.sqrt(len);
      this.x *= len;
      this.y *= len;
      this.z *= len;
      this.w *= len;
    }

    return this
  }

  rotationTo(a, b) {
    var tmpvec3;
    var xUnitVec3 = new Vector3(1, 0, 0);
    var yUnitVec3 = new Vector3(0, 1, 0);

    var dot = a.dot(b);

    if (dot < -0.999999) {
      tmpvec3 = xUnitVec3.cross(a);

      if (tmpvec3.getLength() < 0.000001) {
        tmpvec3 = yUnitVec3.cross(a);
      }

      tmpvec3.normalize();
      this.setAxisAngle(tmpvec3, Math.PI);
      return this;
    } else if (dot > 0.999999) {
      this.x = 0;
      this.y = 0;
      this.z = 0;
      this.w = 1;
      return this;
    } else {
      tmpvec3 = a.cross(b);
      this.x = tmpvec3.x;
      this.y = tmpvec3.y;
      this.z = tmpvec3.z;
      this.w = 1 + dot;
      return this.normalize();
    }
  }


  rotateX(rad) {
    rad *= 0.5;

    var ax = this.x, ay = this.y, az = this.z, aw = this.w,
      bx = Math.sin(rad), bw = Math.cos(rad);

    this.x = ax * bw + aw * bx;
    this.y = ay * bw + az * bx;
    this.z = az * bw - ay * bx;
    this.w = aw * bw - ax * bx;

    return this;
  }

  rotateY(rad) {
    rad *= 0.5;

    var ax = this.x, ay = this.y, az = this.z, aw = this.w,
      by = Math.sin(rad), bw = Math.cos(rad);

    this.x = ax * bw - az * by;
    this.y = ay * bw + aw * by;
    this.z = az * bw + ax * by;
    this.w = aw * bw - ay * by;

    return this;
  }

  rotateZ(rad) {
    rad *= 0.5;

    var ax = this.x, ay = this.y, az = this.z, aw = this.w,
      bz = Math.sin(rad), bw = Math.cos(rad);

    this.x = ax * bw + ay * bz;
    this.y = ay * bw - ax * bz;
    this.z = az * bw + aw * bz;
    this.w = aw * bw - az * bz;

    return this;
  }

}