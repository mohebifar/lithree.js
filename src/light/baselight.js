import Color from '../core/color.js';

var dl_i = 0;

export default
class BaseLight {
  constructor() {
    this.index = dl_i++;
    this.type = 'light';
    this.color = new Color(1, 1, 1);
  }
}