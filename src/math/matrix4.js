import Vector3 from 'vector3.js';
import Vector4 from 'vector4.js';

var EPSILON = 0.00001;

export default
class Matrix4 extends Array {

  /**
   * Matrix4 Constructor
   *
   * @method constructor
   */
  constructor() {
    for (var i = 16; i--;) {
      this.push(0);
    }
  }

  /**
   * Makes this matrix an identity matrix
   *
   * @method identity
   * @returns {Matrix4}
   */
  identity() {
    for (var i = 16; i--;) {
      this[i] = i % 5 === 0 ? 1 : 0;
    }

    return this;
  }

  /**
   * Calculates and return determinant of this matrix
   *
   * @method determinant
   * @returns {number}
   */
  determinant() {
    var a00 = this[0], a01 = this[1], a02 = this[2], a03 = this[3],
      a10 = this[4], a11 = this[5], a12 = this[6], a13 = this[7],
      a20 = this[8], a21 = this[9], a22 = this[10], a23 = this[11],
      a30 = this[12], a31 = this[13], a32 = this[14], a33 = this[15],

      b00 = a00 * a11 - a01 * a10,
      b01 = a00 * a12 - a02 * a10,
      b02 = a00 * a13 - a03 * a10,
      b03 = a01 * a12 - a02 * a11,
      b04 = a01 * a13 - a03 * a11,
      b05 = a02 * a13 - a03 * a12,
      b06 = a20 * a31 - a21 * a30,
      b07 = a20 * a32 - a22 * a30,
      b08 = a20 * a33 - a23 * a30,
      b09 = a21 * a32 - a22 * a31,
      b10 = a21 * a33 - a23 * a31,
      b11 = a22 * a33 - a23 * a32;

    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  }

  perspective(fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
      nf = 1 / (near - far);

    this[0] = f / aspect;
    this[1] = 0;
    this[2] = 0;
    this[3] = 0;
    this[4] = 0;
    this[5] = f;
    this[6] = 0;
    this[7] = 0;
    this[8] = 0;
    this[9] = 0;
    this[10] = (far + near) * nf;
    this[11] = -1;
    this[12] = 0;
    this[13] = 0;
    this[14] = (2 * far * near) * nf;
    this[15] = 0;

    return this;
  }

  /**
   *
   * @method lookAt
   * @param {Vector3} eye
   * @param {Vector3} center
   * @param {Vector3} up
   * @returns {Matrix4} The camera matrix
   */
  lookAt(eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;

    if (Math.abs(eye.x - center.x) < EPSILON &&
      Math.abs(eye.y - center.y) < EPSILON &&
      Math.abs(eye.z - center.z) < EPSILON) {
      return this.identity();
    }

    z0 = eye.x - center.x;
    z1 = eye.y - center.y;
    z2 = eye.z - center.z;

    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = up.y * z2 - up.z * z1;
    x1 = up.z * z0 - up.x * z2;
    x2 = up.x * z1 - up.y * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    } else {
      len = 1 / len;
      x0 *= len;
      x1 *= len;
      x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    } else {
      len = 1 / len;
      y0 *= len;
      y1 *= len;
      y2 *= len;
    }

    this[0] = x0;
    this[1] = y0;
    this[2] = z0;
    this[3] = 0;
    this[4] = x1;
    this[5] = y1;
    this[6] = z1;
    this[7] = 0;
    this[8] = x2;
    this[9] = y2;
    this[10] = z2;
    this[11] = 0;
    this[12] = -(x0 * eye.x + x1 * eye.y + x2 * eye.z);
    this[13] = -(y0 * eye.x + y1 * eye.y + y2 * eye.z);
    this[14] = -(z0 * eye.x + z1 * eye.y + z2 * eye.z);
    this[15] = 1;

    return this;
  }

  /**
   * Translate this matrix by given vector
   *
   * @method translate
   * @param {Vector3} vector
   * @returns {Matrix4}
   */
  translate(vector) {
    this[12] = this[0] * vector.x + this[4] * vector.y + this[8] * vector.z + this[12];
    this[13] = this[1] * vector.x + this[5] * vector.y + this[9] * vector.z + this[13];
    this[14] = this[2] * vector.x + this[6] * vector.y + this[10] * vector.z + this[14];
    this[15] = this[3] * vector.x + this[7] * vector.y + this[11] * vector.z + this[15];

    return this;
  }

  /**
   * Rotate this matrix by given angle and axis
   *
   * @param {Number} rad
   * @param {Vector3} axis
   * @returns {Matrix4}
   */
  rotate(rad, axis) {
    var _axis = axis.clone(),
      s, c, t,
      a00, a01, a02, a03,
      a10, a11, a12, a13,
      a20, a21, a22, a23,
      b00, b01, b02,
      b10, b11, b12,
      b20, b21, b22;

    _axis.normalize();

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    a00 = this[0];
    a01 = this[1];
    a02 = this[2];
    a03 = this[3];
    a10 = this[4];
    a11 = this[5];
    a12 = this[6];
    a13 = this[7];
    a20 = this[8];
    a21 = this[9];
    a22 = this[10];
    a23 = this[11];

    // Construct the elements of the rotation matrix
    b00 = _axis.x * _axis.x * t + c;
    b01 = _axis.y * _axis.x * t + _axis.z * s;
    b02 = _axis.z * _axis.x * t - _axis.y * s;
    b10 = _axis.x * _axis.y * t - _axis.z * s;
    b11 = _axis.y * _axis.y * t + c;
    b12 = _axis.z * _axis.y * t + _axis.x * s;
    b20 = _axis.x * _axis.z * t + _axis.y * s;
    b21 = _axis.y * _axis.z * t - _axis.x * s;
    b22 = _axis.z * _axis.z * t + c;

    // Perform rotation-specific matrix multiplication
    this[0] = a00 * b00 + a10 * b01 + a20 * b02;
    this[1] = a01 * b00 + a11 * b01 + a21 * b02;
    this[2] = a02 * b00 + a12 * b01 + a22 * b02;
    this[3] = a03 * b00 + a13 * b01 + a23 * b02;
    this[4] = a00 * b10 + a10 * b11 + a20 * b12;
    this[5] = a01 * b10 + a11 * b11 + a21 * b12;
    this[6] = a02 * b10 + a12 * b11 + a22 * b12;
    this[7] = a03 * b10 + a13 * b11 + a23 * b12;
    this[8] = a00 * b20 + a10 * b21 + a20 * b22;
    this[9] = a01 * b20 + a11 * b21 + a21 * b22;
    this[10] = a02 * b20 + a12 * b21 + a22 * b22;
    this[11] = a03 * b20 + a13 * b21 + a23 * b22;

    return this;
  }

  invert() {
    // Cache the matrix values (makes for huge speed increases!)
    var a00 = this[0], a01 = this[1], a02 = this[2], a03 = this[3];
    var a10 = this[4], a11 = this[5], a12 = this[6], a13 = this[7];
    var a20 = this[8], a21 = this[9], a22 = this[10], a23 = this[11];
    var a30 = this[12], a31 = this[13], a32 = this[14], a33 = this[15];

    var b00 = a00 * a11 - a01 * a10;
    var b01 = a00 * a12 - a02 * a10;
    var b02 = a00 * a13 - a03 * a10;
    var b03 = a01 * a12 - a02 * a11;
    var b04 = a01 * a13 - a03 * a11;
    var b05 = a02 * a13 - a03 * a12;
    var b06 = a20 * a31 - a21 * a30;
    var b07 = a20 * a32 - a22 * a30;
    var b08 = a20 * a33 - a23 * a30;
    var b09 = a21 * a32 - a22 * a31;
    var b10 = a21 * a33 - a23 * a31;
    var b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant (inlined to avoid double-caching)
    var invDet = 1 / (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06);

    this[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
    this[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
    this[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
    this[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;
    this[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
    this[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
    this[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
    this[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
    this[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
    this[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
    this[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
    this[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;
    this[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
    this[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
    this[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
    this[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;

    return this;
  }

  /**
   * Rotates by given angle and giving X axis
   *
   * @param {Number} rad The angle by radian
   */
  rotateX(rad) {
    this.rotate(rad, new Vector3(1, 0, 0));
  }

  /**
   * Rotates by given angle and giving Y axis
   *
   * @param {Number} rad The angle by radian
   */
  rotateY(rad) {
    this.rotate(rad, new Vector3(0, 1, 0));
  }

  /**
   * Rotates by given angle and giving Z axis
   *
   * @param {Number} rad The angle by radian
   */
  rotateZ(rad) {
    this.rotate(rad, new Vector3(0, 0, 1));
  }

  clone() {
    var cloned = new Matrix4();

    for (var i = 16; i--;) {
      cloned[i] = this[i];
    }

    return cloned;
  }

  /**
   * Returns an array of this matrix
   *
   * @returns {Array}
   */
  toArray() {
    var result = [];

    for (var i = 16; i--;) {
      result[i] = this[i];
    }

    return result;
  }

  static multiplyVec4(mat, vec) {
    var result = new Vector4();

    result.x = mat[0] * vec.x + mat[4] * vec.y + mat[8] * vec.z + mat[12] * vec.w;
    result.y = mat[1] * vec.x + mat[5] * vec.y + mat[9] * vec.z + mat[13] * vec.w;
    result.z = mat[2] * vec.x + mat[6] * vec.y + mat[10] * vec.z + mat[14] * vec.w;
    result.w = mat[3] * vec.x + mat[7] * vec.y + mat[11] * vec.z + mat[15] * vec.w;

    return result;
  }

  static multiplyMatrices(a, b) {

    var result = new Matrix4();

    var a11 = a[0], a12 = a[4], a13 = a[8], a14 = a[12];
    var a21 = a[1], a22 = a[5], a23 = a[9], a24 = a[13];
    var a31 = a[2], a32 = a[6], a33 = a[10], a34 = a[14];
    var a41 = a[3], a42 = a[7], a43 = a[11], a44 = a[15];

    var b11 = b[0], b12 = b[4], b13 = b[8], b14 = b[12];
    var b21 = b[1], b22 = b[5], b23 = b[9], b24 = b[13];
    var b31 = b[2], b32 = b[6], b33 = b[10], b34 = b[14];
    var b41 = b[3], b42 = b[7], b43 = b[11], b44 = b[15];

    result[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
    result[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
    result[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
    result[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

    result[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
    result[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
    result[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
    result[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

    result[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
    result[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
    result[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
    result[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

    result[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
    result[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
    result[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
    result[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

    return result;

  }

  static fromRotationTranslationScaleOrigin(q, v, s, o) {
    var x = q.x, y = q.y, z = q.z, w = q.w,
      x2 = x + x,
      y2 = y + y,
      z2 = z + z,

      xx = x * x2,
      xy = x * y2,
      xz = x * z2,
      yy = y * y2,
      yz = y * z2,
      zz = z * z2,
      wx = w * x2,
      wy = w * y2,
      wz = w * z2,

      sx = s.x,
      sy = s.y,
      sz = s.z,

      ox = o.x,
      oy = o.y,
      oz = o.z;

    var out = new Matrix4();
    out[0] = (1 - (yy + zz)) * sx;
    out[1] = (xy + wz) * sx;
    out[2] = (xz - wy) * sx;
    out[3] = 0;
    out[4] = (xy - wz) * sy;
    out[5] = (1 - (xx + zz)) * sy;
    out[6] = (yz + wx) * sy;
    out[7] = 0;
    out[8] = (xz + wy) * sz;
    out[9] = (yz - wx) * sz;
    out[10] = (1 - (xx + yy)) * sz;
    out[11] = 0;
    out[12] = v.x + ox - (out[0] * ox + out[4] * oy + out[8] * oz);
    out[13] = v.y + oy - (out[1] * ox + out[5] * oy + out[9] * oz);
    out[14] = v.z + oz - (out[2] * ox + out[6] * oy + out[10] * oz);
    out[15] = 1;

    return out;
  }

}