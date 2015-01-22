export default
class Matrix3 extends Array {
  constructor() {
    for (var i = 9; i--;) {
      this.push(0);
    }
  }

  transpose() {
    var a01 = this[1], a02 = this[2];
    var a12 = this[5];

    this[1] = this[3];
    this[2] = this[6];
    this[3] = a01;
    this[5] = this[7];
    this[6] = a02;
    this[7] = a12;
    return this;
  }

  toArray() {
    var result = [];

    for (var i = 9; i--;) {
      result[i] = this[i];
    }

    return result;
  }
}