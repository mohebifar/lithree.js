export default
class Vector3 extends Array {
  constructor(x = 0, y = 0, z = 0) {
    this.push(x);
    this.push(y);
    this.push(z);
  }

  add(value) {
    if (value instanceof Vector3) {
      this.x += value.x;
      this.y += value.y;
      this.z += value.z;
    } else {
      this.x += value;
      this.y += value;
      this.z += value;
    }
  }

  subtract(value) {
    if (value instanceof Vector3) {
      this.x -= value.x;
      this.y -= value.y;
      this.z -= value.z;
    } else {
      this.add(-value);
    }
  }

  multiply(value) {
    if (value instanceof Vector3) {
      this.x *= value.x;
      this.y *= value.y;
      this.z *= value.z;
    } else {
      this.x *= value;
      this.y *= value;
      this.z *= value;
    }
  }

  divide(value) {
    if (value instanceof Vector3) {
      this.x /= value.x;
      this.y /= value.y;
      this.z /= value.z;
    } else {
      this.multiply(1 / value);
    }
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

  clone() {
    return new Vector3(this.x, this.y, this.z);
  }

  set x(x) {
    this[0] = x;
  }

  set y(y) {
    this[1] = y;
  }

  set z(z) {
    this[2] = z;
  }

  get x() {
    return this[0];
  }

  get y() {
    return this[1];
  }

  get z() {
    return this[2];
  }
}