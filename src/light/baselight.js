import Color from '../core/color.js';

var lightId = 0;

export default
class BaseLight {
  constructor() {
    this.index = lightId++;
    this.type = 'light';
    this.color = new Color(1, 1, 1);
  }
}