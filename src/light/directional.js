import Vector3 from '../math/vector3.js';
import BaseLight from 'light.js';

export default
class DirectionalLight extends BaseLight {
  constructor() {
    super.constructor();
    this.direction = new Vector3(1, 1, 1);
  }
}