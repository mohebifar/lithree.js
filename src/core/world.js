import BaseLight from '../light/light.js';
import Object3D from '../object/object3d.js';

export default
class World {

  constructor() {
    this.children = [];
    this.lights = [];
  }

  add(object) {
    if(object instanceof BaseLight) {
      this.lights.push(object);
    } else {
      this.children.push(object);
    }
  }

  remove(object) {
    if(object instanceof BaseLight) {
      this.lights.splice(this.lights.indexOf(object), 1);
    } else {
      this.children.splice(this.children.indexOf(object), 1);
    }
  }

}