var GLMAT_EPSILON = 0.00001;

export default
class Matrix4 extends Array {
  constructor() {
    for (var i = 16; i--;) {
      this.push(0);
    }
  }

  identity() {
    for (var i = 16; i--;) {
      this[i] = i % 5 === 0 ? 1 : 0;
    }

    return this;
  }

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

  lookAt(eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
      eyeX = eye[0],
      eyeY = eye[1],
      eyeZ = eye[2],
      upX = up[0],
      upY = up[1],
      upZ = up[2],
      centerX = center[0],
      centerY = center[1],
      centerZ = center[2];

    if (Math.abs(eyeX - centerX) < GLMAT_EPSILON &&
      Math.abs(eyeY - centerY) < GLMAT_EPSILON &&
      Math.abs(eyeZ - centerZ) < GLMAT_EPSILON) {
      return this.identity();
    }

    z0 = eyeX - centerX;
    z1 = eyeY - centerY;
    z2 = eyeZ - centerZ;

    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upY * z2 - upZ * z1;
    x1 = upZ * z0 - upX * z2;
    x2 = upX * z1 - upY * z0;
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
    this[12] = -(x0 * eyeX + x1 * eyeY + x2 * eyeZ);
    this[13] = -(y0 * eyeX + y1 * eyeY + y2 * eyeZ);
    this[14] = -(z0 * eyeX + z1 * eyeY + z2 * eyeZ);
    this[15] = 1;

    return this;
  }

  translate(v) {
    this[12] = this[0] * v.x + this[4] * v.y + this[8] * v.z + this[12];
    this[13] = this[1] * v.x + this[5] * v.y + this[9] * v.z + this[13];
    this[14] = this[2] * v.x + this[6] * v.y + this[10] * v.z + this[14];
    this[15] = this[3] * v.x + this[7] * v.y + this[11] * v.z + this[15];

    return this;
  }

  rotate(rad, _axis) {
    var axis = _axis.clone(),
      s, c, t,
      a00, a01, a02, a03,
      a10, a11, a12, a13,
      a20, a21, a22, a23,
      b00, b01, b02,
      b10, b11, b12,
      b20, b21, b22;

    axis.normalize();

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
    b00 = axis.x * axis.x * t + c;
    b01 = axis.y * axis.x * t + axis.z * s;
    b02 = axis.z * axis.x * t - axis.y * s;
    b10 = axis.x * axis.y * t - axis.z * s;
    b11 = axis.y * axis.y * t + c;
    b12 = axis.z * axis.y * t + axis.x * s;
    b20 = axis.x * axis.z * t + axis.y * s;
    b21 = axis.y * axis.z * t - axis.x * s;
    b22 = axis.z * axis.z * t + c;

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

  toInverseMat3() {
    var a00 = this[0], a01 = this[1], a02 = this[2];
    var a10 = this[4], a11 = this[5], a12 = this[6];
    var a20 = this[8], a21 = this[9], a22 = this[10];

    var b01 = a22 * a11 - a12 * a21;
    var b11 = -a22 * a10 + a12 * a20;
    var b21 = a21 * a10 - a11 * a20;

    var d = a00 * b01 + a01 * b11 + a02 * b21;
    if (!d) {
      return null;
    }
    var id = 1 / d;

    var dest = new Matrix3();

    dest[0] = b01 * id;
    dest[1] = (-a22 * a01 + a02 * a21) * id;
    dest[2] = (a12 * a01 - a02 * a11) * id;
    dest[3] = b11 * id;
    dest[4] = (a22 * a00 - a02 * a20) * id;
    dest[5] = (-a12 * a00 + a02 * a10) * id;
    dest[6] = b21 * id;
    dest[7] = (-a21 * a00 + a01 * a20) * id;
    dest[8] = (a11 * a00 - a01 * a10) * id;

    return dest;
  }

  rotateX(rad) {
    this.rotate(rad, new Vector3(1, 0, 0));
  }

  rotateY(rad) {
    this.rotate(rad, new Vector3(0, 1, 0));
  }

  rotateZ(rad) {
    this.rotate(rad, new Vector3(0, 0, 1));
  }

  toArray() {
    var result = [];

    for (var i = 16; i--;) {
      result[i] = this[i];
    }

    return result;
  }
}