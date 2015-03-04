import Emitter from '../core/emitter.js';
import Vector3 from 'vector3.js';

export default
class Vector4 extends Emitter {

  constructor(x = 0, y = 0, z = 0, w = 0) {
    super();

    this._x = x;
    this._y = y;
    this._z = z;
    this._w = w;
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

  get w() {
    return this._w;
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

  set(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  toArray() {
    return [this.x, this.y, this.z, this.w];
  }
  
}