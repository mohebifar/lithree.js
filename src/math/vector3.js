export default
class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  clone() {
    return new Vector3(this.x, this.y, this.z);
  }

  set(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
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

  toArray() {
    return [this.x, this.y, this.z];
  }
}